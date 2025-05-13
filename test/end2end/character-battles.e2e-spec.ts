import { INestApplication } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { TestUtils } from '../utils/test-utils'

// issue the following command to run this test:
// npx jest --config ./test/jest-e2e.json test/character-battles.e2e-spec.ts

describe('Character and battle interaction (e2e)', () => {
  let app: INestApplication
  let player1: { playerId: number; username: string; token: string }
  let player2: { playerId: number; username: string; token: string }
  let gameId: number
  let character1Id: number
  let character2Id: number
  let battleId: number

  beforeAll(async () => {
    app = await TestUtils.createApp()
    player1 = await TestUtils.registerAndLoginPlayer(app)
    player2 = await TestUtils.registerAndLoginPlayer(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a game as player1 and add player2 to the game', async () => {
    const gameResponse = await TestUtils.buildAuthorizedRequest(app, 'post', '/games', player1.token, {
      name: `test game ${uuidv4()}`
    })
    expect(gameResponse.status).toBe(201)
    gameId = gameResponse.body.id

    const addPlayerResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/players/${player2.playerId}`,
      player1.token
    )
    expect(addPlayerResponse.status).toBe(201)
  })

  it('should create characters for both players', async () => {
    const character1Response = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/characters`,
      player1.token,
      {
        name: `character1_${uuidv4()}`,
        strength: 3,
        dexterity: 3,
        intelligence: 3,
        raceId: 1,
        skills: []
      }
    )
    expect(character1Response.status).toBe(201)
    character1Id = character1Response.body.id

    const character2Response = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/characters`,
      player2.token,
      {
        name: `character2_${uuidv4()}`,
        strength: 3,
        dexterity: 3,
        intelligence: 3,
        raceId: 1,
        skills: []
      }
    )
    expect(character2Response.status).toBe(201)
    character2Id = character2Response.body.id
  })

  it('should create a battle and join both characters', async () => {
    const battleResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/battles`,
      player1.token
    )
    expect(battleResponse.status).toBe(201)
    battleId = battleResponse.body.id

    const joinBattleResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/battles/${battleId}/join`,
      player2.token
    )
    expect(joinBattleResponse.status).toBe(201)

    //get the battle and verify both characters are in it
    const battleStatusResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/battles/${battleId}`,
      player1.token
    )
    expect(battleStatusResponse.status).toBe(200)
    expect(battleStatusResponse.body.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: character1Id }),
        expect.objectContaining({ id: character2Id })
      ])
    )
  })

  it('should delete player1 and verify player2 is still in the battle', async () => {
    const deletePlayer1Response = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/players/${player1.playerId}`,
      player1.token
    )
    //TODO: this fails for cascading reasons, as expected, need to fix the controller
    expect(deletePlayer1Response.status).toBe(200)

    const battleStatusResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/battles/${battleId}`,
      player2.token
    )
    expect(battleStatusResponse.status).toBe(200)
    expect(battleStatusResponse.body.participants).toEqual(
      expect.arrayContaining([expect.objectContaining({ characterId: character2Id })])
    )
  })
})
