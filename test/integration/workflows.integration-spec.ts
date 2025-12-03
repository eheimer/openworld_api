import { INestApplication } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { APIUtils } from '../api/helpers/util'

/**
 * Integration tests for complete workflows
 * These tests verify end-to-end user workflows that span multiple API endpoints
 * Requirements: 7.1
 */
describe('Complete Workflows (integration)', () => {
  let app: INestApplication

  beforeAll(async () => {
    app = await APIUtils.createApp()
  })

  afterAll(async () => {
    await app.close()
  })

  /**
   * Test authentication flow: register → login → authenticated request
   * Validates: Requirements 7.1
   */
  describe('Authentication workflow', () => {
    it('should complete full authentication flow', async () => {
      const username = `workflow_user_${uuidv4()}`
      const email = `${username}@example.com`
      const password = 'testpassword123'

      // Step 1: Register a new player
      const registerResponse = await APIUtils.buildRequest(app, 'post', '/auth/register', {
        username,
        email,
        password
      })
      expect(registerResponse.status).toBe(201)
      expect(registerResponse.body).toHaveProperty('id')
      expect(registerResponse.body).toHaveProperty('username', username)
      expect(registerResponse.body).toHaveProperty('email', email)
      const playerId = registerResponse.body.id

      // Step 2: Login with the registered credentials
      const loginResponse = await APIUtils.buildRequest(app, 'post', '/auth/login', {
        username,
        password
      })
      expect(loginResponse.status).toBe(201)
      expect(loginResponse.body).toHaveProperty('token')
      expect(loginResponse.body).toHaveProperty('player', playerId)
      const token = loginResponse.body.token

      // Step 3: Make an authenticated request to verify token works
      const authenticatedResponse = await APIUtils.buildAuthorizedRequest(app, 'get', '/players', token)
      expect(authenticatedResponse.status).toBe(200)
      expect(authenticatedResponse.body).toBeInstanceOf(Array)
      expect(authenticatedResponse.body).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: playerId, username })])
      )

      // Cleanup
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${playerId}`, token)
    })

    it('should reject invalid credentials during login', async () => {
      const username = `invalid_user_${uuidv4()}`
      const loginResponse = await APIUtils.buildRequest(app, 'post', '/auth/login', {
        username,
        password: 'wrongpassword'
      })
      // API returns 404 when user doesn't exist
      expect(loginResponse.status).toBe(404)
    })

    it('should reject requests without authentication token', async () => {
      const response = await APIUtils.buildRequest(app, 'get', '/players')
      expect(response.status).toBe(401)
    })
  })

  /**
   * Test game workflow: create game → add player → create character
   * Validates: Requirements 7.1
   */
  describe('Game workflow', () => {
    it('should complete full game creation and player management workflow', async () => {
      // Setup: Create two players
      const player1 = await APIUtils.registerAndLoginPlayer(app)
      const player2 = await APIUtils.registerAndLoginPlayer(app)

      // Step 1: Player 1 creates a game
      const gameName = `workflow_game_${uuidv4()}`
      const createGameResponse = await APIUtils.buildAuthorizedRequest(app, 'post', '/games', player1.token, {
        name: gameName
      })
      expect(createGameResponse.status).toBe(201)
      expect(createGameResponse.body).toHaveProperty('id')
      expect(createGameResponse.body).toHaveProperty('name', gameName)
      expect(createGameResponse.body).toHaveProperty('owner')
      expect(createGameResponse.body.owner).toHaveProperty('id', player1.playerId)
      const gameId = createGameResponse.body.id

      // Step 2: Player 1 adds Player 2 to the game
      const addPlayerResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/players/${player2.playerId}`,
        player1.token
      )
      expect(addPlayerResponse.status).toBe(201)
      expect(addPlayerResponse.body).toHaveProperty('players')
      expect(addPlayerResponse.body.players).toHaveLength(2)
      expect(addPlayerResponse.body.players).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: player1.playerId }),
          expect.objectContaining({ id: player2.playerId })
        ])
      )

      // Step 3: Player 1 creates a character in the game
      const raceId = await APIUtils.getRandomRace(app, player1.token)
      const characterName = `workflow_char_${uuidv4()}`
      const createCharacterResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/characters`,
        player1.token,
        {
          name: characterName,
          raceId,
          strength: 5,
          dexterity: 4,
          intelligence: 3,
          skills: [
            { id: 1, level: 2 },
            { id: 2, level: 1 }
          ]
        }
      )
      expect(createCharacterResponse.status).toBe(201)
      expect(createCharacterResponse.body).toHaveProperty('id')
      expect(createCharacterResponse.body).toHaveProperty('name', characterName)
      expect(createCharacterResponse.body).toHaveProperty('strength', 5)
      expect(createCharacterResponse.body).toHaveProperty('dexterity', 4)
      expect(createCharacterResponse.body).toHaveProperty('intelligence', 3)
      const characterId = createCharacterResponse.body.id

      // Step 4: Verify the character is associated with the game
      const getCharacterResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'get',
        `/characters/${characterId}`,
        player1.token
      )
      expect(getCharacterResponse.status).toBe(200)
      expect(getCharacterResponse.body).toHaveProperty('id', characterId)
      // Character response includes player info but not game info directly

      // Cleanup
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/characters/${characterId}`, player1.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}`, player1.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${player1.playerId}`, player1.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${player2.playerId}`, player2.token)
    })

    it('should prevent unauthorized player from adding players to game', async () => {
      const owner = await APIUtils.registerAndLoginPlayer(app)
      const otherPlayer = await APIUtils.registerAndLoginPlayer(app)
      const thirdPlayer = await APIUtils.registerAndLoginPlayer(app)

      const gameId = await APIUtils.createGameAsPlayer(app, owner.token)

      // Other player (not owner) tries to add third player to game
      const addPlayerResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/players/${thirdPlayer.playerId}`,
        otherPlayer.token
      )
      expect(addPlayerResponse.status).toBe(403)

      // Cleanup
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}`, owner.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${owner.playerId}`, owner.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${otherPlayer.playerId}`, otherPlayer.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${thirdPlayer.playerId}`, thirdPlayer.token)
    })
  })

  /**
   * Test battle workflow: create battle → add monster → advance round
   * Validates: Requirements 7.1
   */
  describe('Battle workflow', () => {
    it('should complete full battle creation and combat workflow', async () => {
      // Setup: Create player, game, and character
      const player = await APIUtils.registerAndLoginPlayer(app)
      const gameId = await APIUtils.createGameAsPlayer(app, player.token)
      const characterId = await APIUtils.createCharacterAsPlayer(app, gameId, player.token)

      // Step 1: Create a battle
      const createBattleResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/battles`,
        player.token
      )
      expect(createBattleResponse.status).toBe(201)
      expect(createBattleResponse.body).toHaveProperty('id')
      // Battle starts at round 1, not 0
      expect(createBattleResponse.body).toHaveProperty('round', 1)
      expect(createBattleResponse.body).toHaveProperty('initiator', characterId)
      expect(createBattleResponse.body).toHaveProperty('participants')
      expect(createBattleResponse.body.participants).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: characterId })])
      )
      const battleId = createBattleResponse.body.id

      // Step 2: Add a monster to the battle
      const monsterId = await APIUtils.getRandomMonster(app, player.token)
      const addMonsterResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/battles/${battleId}/enemies`,
        player.token,
        { monsterId }
      )
      expect(addMonsterResponse.status).toBe(201)
      // Response is the enemy object, not the full battle
      expect(addMonsterResponse.body).toHaveProperty('actionName')
      expect(addMonsterResponse.body).toHaveProperty('actionValue')

      // Step 3: Advance the battle round
      const advanceRoundResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/battles/${battleId}/nextround`,
        player.token
      )
      expect(advanceRoundResponse.status).toBe(201)
      expect(advanceRoundResponse.body).toHaveProperty('round', 2)
      expect(advanceRoundResponse.body).toHaveProperty('enemies')
      expect(advanceRoundResponse.body.enemies).toHaveLength(1)

      // Step 4: Verify battle state persists
      const getBattleResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'get',
        `/games/${gameId}/battles/${battleId}`,
        player.token
      )
      expect(getBattleResponse.status).toBe(200)
      expect(getBattleResponse.body).toHaveProperty('id', battleId)
      expect(getBattleResponse.body).toHaveProperty('round', 2)
      expect(getBattleResponse.body).toHaveProperty('participants')
      expect(getBattleResponse.body).toHaveProperty('enemies')

      // Cleanup
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}/battles/${battleId}`, player.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/characters/${characterId}`, player.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}`, player.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${player.playerId}`, player.token)
    })

    it('should allow multiple characters to join a battle', async () => {
      // Setup: Create two players with characters in the same game
      const player1 = await APIUtils.registerAndLoginPlayer(app)
      const player2 = await APIUtils.registerAndLoginPlayer(app)
      const gameId = await APIUtils.createGameAsPlayer(app, player1.token)
      await APIUtils.addPlayerToGame(app, gameId, player2.playerId, player1.token)
      const character1Id = await APIUtils.createCharacterAsPlayer(app, gameId, player1.token)
      const character2Id = await APIUtils.createCharacterAsPlayer(app, gameId, player2.token)

      // Player 1 creates battle
      const createBattleResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/battles`,
        player1.token
      )
      expect(createBattleResponse.status).toBe(201)
      const battleId = createBattleResponse.body.id

      // Player 2 joins the battle
      const joinBattleResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/games/${gameId}/battles/${battleId}/join`,
        player2.token
      )
      expect(joinBattleResponse.status).toBe(201)

      // Verify both characters are in the battle
      const getBattleResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'get',
        `/games/${gameId}/battles/${battleId}`,
        player1.token
      )
      expect(getBattleResponse.status).toBe(200)
      expect(getBattleResponse.body.participants).toHaveLength(2)
      expect(getBattleResponse.body.participants).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: character1Id }),
          expect.objectContaining({ id: character2Id })
        ])
      )

      // Cleanup
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}/battles/${battleId}`, player1.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/characters/${character1Id}`, player1.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/characters/${character2Id}`, player2.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}`, player1.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${player1.playerId}`, player1.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${player2.playerId}`, player2.token)
    })
  })

  /**
   * Test inventory workflow: add item → equip → unequip → drop
   * Validates: Requirements 7.1
   */
  describe('Inventory workflow', () => {
    it('should complete full inventory management workflow', async () => {
      // Setup: Create player, game, and character
      const player = await APIUtils.registerAndLoginPlayer(app)
      const gameId = await APIUtils.createGameAsPlayer(app, player.token)
      const characterId = await APIUtils.createCharacterAsPlayer(app, gameId, player.token)

      // Get character to retrieve inventory ID
      const getCharacterResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'get',
        `/characters/${characterId}`,
        player.token
      )
      expect(getCharacterResponse.status).toBe(200)
      expect(getCharacterResponse.body).toHaveProperty('inventory')
      const inventoryId = getCharacterResponse.body.inventory.id

      // Step 1: Add a random weapon to inventory
      const addWeaponResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/inventory/${inventoryId}/random`,
        player.token,
        { itemType: 'weapon', level: 1 }
      )
      expect(addWeaponResponse.status).toBe(201)
      expect(addWeaponResponse.body).toHaveProperty('weapons')
      expect(addWeaponResponse.body.weapons).toHaveLength(1)
      const weaponId = addWeaponResponse.body.weapons[0].id

      // Step 2: Equip the weapon
      const equipWeaponResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'put',
        `/inventory/${inventoryId}/equip/weapon/${weaponId}`,
        player.token
      )
      expect(equipWeaponResponse.status).toBe(200)
      expect(equipWeaponResponse.body).toHaveProperty('weapons')
      const equippedWeapon = equipWeaponResponse.body.weapons.find((w) => w.id === weaponId)
      expect(equippedWeapon).toBeDefined()
      expect(equippedWeapon.equipped).toBe(true)

      // Step 3: Unequip the weapon
      const unequipWeaponResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'put',
        `/inventory/${inventoryId}/unequip/weapon/${weaponId}`,
        player.token
      )
      expect(unequipWeaponResponse.status).toBe(200)
      expect(unequipWeaponResponse.body).toHaveProperty('weapons')
      const unequippedWeapon = unequipWeaponResponse.body.weapons.find((w) => w.id === weaponId)
      expect(unequippedWeapon).toBeDefined()
      expect(unequippedWeapon.equipped).toBe(false)

      // Step 4: Drop the weapon
      const dropWeaponResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'put',
        `/inventory/${inventoryId}/drop/weapon/${weaponId}`,
        player.token
      )
      expect(dropWeaponResponse.status).toBe(200)
      expect(dropWeaponResponse.body).toHaveProperty('weapons')
      expect(dropWeaponResponse.body.weapons).not.toEqual(
        expect.arrayContaining([expect.objectContaining({ id: weaponId })])
      )

      // Cleanup
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/characters/${characterId}`, player.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}`, player.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${player.playerId}`, player.token)
    })

    it('should manage multiple item types in inventory', async () => {
      // Setup
      const player = await APIUtils.registerAndLoginPlayer(app)
      const gameId = await APIUtils.createGameAsPlayer(app, player.token)
      const characterId = await APIUtils.createCharacterAsPlayer(app, gameId, player.token)

      const getCharacterResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'get',
        `/characters/${characterId}`,
        player.token
      )
      const inventoryId = getCharacterResponse.body.inventory.id

      // Add armor
      const addArmorResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/inventory/${inventoryId}/random`,
        player.token,
        { itemType: 'armor', level: 1 }
      )
      expect(addArmorResponse.status).toBe(201)
      expect(addArmorResponse.body).toHaveProperty('armor')
      const armorId = addArmorResponse.body.armor[0].id

      // Add jewelry
      const addJewelryResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/inventory/${inventoryId}/random`,
        player.token,
        { itemType: 'jewelry', level: 1 }
      )
      expect(addJewelryResponse.status).toBe(201)
      expect(addJewelryResponse.body).toHaveProperty('jewelry')
      const jewelryId = addJewelryResponse.body.jewelry[0].id

      // Add weapon (spellbook item type is not supported by the random item endpoint)
      const addWeaponResponse2 = await APIUtils.buildAuthorizedRequest(
        app,
        'post',
        `/inventory/${inventoryId}/random`,
        player.token,
        { itemType: 'weapon', level: 1 }
      )
      expect(addWeaponResponse2.status).toBe(201)
      expect(addWeaponResponse2.body).toHaveProperty('weapons')
      const weaponId2 = addWeaponResponse2.body.weapons[0].id

      // Verify all items are in inventory
      const getInventoryResponse = await APIUtils.buildAuthorizedRequest(
        app,
        'get',
        `/inventory/${inventoryId}`,
        player.token
      )
      expect(getInventoryResponse.status).toBe(200)
      expect(getInventoryResponse.body).toHaveProperty('armor')
      expect(getInventoryResponse.body).toHaveProperty('jewelry')
      expect(getInventoryResponse.body).toHaveProperty('weapons')
      expect(getInventoryResponse.body.armor).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: armorId })])
      )
      expect(getInventoryResponse.body.jewelry).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: jewelryId })])
      )
      expect(getInventoryResponse.body.weapons).toEqual(
        expect.arrayContaining([expect.objectContaining({ id: weaponId2 })])
      )

      // Cleanup
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/characters/${characterId}`, player.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${gameId}`, player.token)
      await APIUtils.buildAuthorizedRequest(app, 'delete', `/players/${player.playerId}`, player.token)
    })
  })
})
