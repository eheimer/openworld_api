import { INestApplication } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { TestUtils } from './utils/test-utils'

// issue the following command to run this test:
// npx jest --config ./test/jest-e2e.json test/character.e2e-spec.ts

describe('Character functionality (e2e)', () => {
  let app: INestApplication
  let player: { playerId: number; username: string; token: string }
  let gameId: number
  let raceId: number

  let characterId: number
  let battleId: number

  beforeAll(async () => {
    app = await TestUtils.createApp()
    player = await TestUtils.registerAndLoginPlayer(app)
    gameId = await TestUtils.createGameAsPlayer(app, player.token)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a character, and a battle', async () => {
    raceId = await TestUtils.getRandomRace(app, player.token)

    // Create a character
    const characterResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/characters`,
      player.token,
      {
        name: `character ${uuidv4()}`,
        raceId,
        strength: 3,
        dexterity: 3,
        intelligence: 3,
        skills: [
          { id: 1, level: 1 },
          { id: 2, level: 3 }
        ]
      }
    )
    expect(characterResponse.status).toBe(201)
    characterId = characterResponse.body.id

    // Create a battle
    const battleResponse = await TestUtils.buildAuthorizedRequest(app, 'post', `/games/${gameId}/battles`, player.token)
    battleId = battleResponse.body.id
    expect(battleResponse.status).toBe(201)
  })

  it('should verify the players games', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/games', player.token)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(
      expect.arrayContaining([expect.objectContaining({ game: expect.objectContaining({ id: gameId }) })])
    )
  })

  it('should verify the players character', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', `/characters/${characterId}`, player.token)
    expect(response.status).toBe(200)
    expect(response.body).toEqual(expect.objectContaining({ id: characterId }))
  })

  //TODO: deletes fail, controller needs fixing
  it('should delete the battle', async () => {
    // Delete the battle
    const deleteBattleResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/games/${gameId}/battles/${battleId}`,
      player.token
    )
    expect(deleteBattleResponse.status).toBe(200)

    // Verify the character was not deleted
    const characterResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/characters/${characterId}`,
      player.token
    )
    expect(characterResponse.status).toBe(200)
    expect(characterResponse.body.id).toBe(characterId)
  })

  it('should delete the character', async () => {
    // Create a new battle first
    const battleResponse = await TestUtils.buildAuthorizedRequest(app, 'post', `/games/${gameId}/battles`, player.token)
    expect(battleResponse.status).toBe(201)

    // Delete the character
    const deleteCharacterResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/characters/${characterId}`,
      player.token
    )
    expect(deleteCharacterResponse.status).toBe(200)

    // Verify the battle was not deleted
    const battleStatusResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/battles`,
      player.token
    )
    expect(battleStatusResponse.status).toBe(200)
  })

  it('should delete the player', async () => {
    // Delete the player
    const deletePlayerResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/players/${player.playerId}`,
      player.token
    )
    expect(deletePlayerResponse.status).toBe(200)

    // Verify the character and battle are deleted
    const characterResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/characters/${characterId}`,
      player.token
    )
    expect(characterResponse.status).toBe(404)

    const battleResponse = await TestUtils.buildAuthorizedRequest(app, 'get', `/games/${gameId}/battles`, player.token)
    expect(battleResponse.status).toBe(404)
  })
})
