import { INestApplication } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { TestUtils } from '../api/helpers/test-utils'

// issue the following command to run this test:
// npx jest --config ./test/jest-e2e.json test/battles.e2e-spec.ts

describe('Battle functionality (e2e)', () => {
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
    gameId = await TestUtils.createGameAsPlayer(app, player1.token)
    await TestUtils.addPlayerToGame(app, gameId, player2.playerId, player1.token)
    character1Id = await TestUtils.createCharacterAsPlayer(app, gameId, player1.token)
    character2Id = await TestUtils.createCharacterAsPlayer(app, gameId, player2.token)
  })

  afterAll(async () => {
    await app.close()
  })

  //TODO: might want to test that player2 has to be in the same game
  // as player1 to join the battle

  it('create a battle, character 2 should join the battle', async () => {
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
    // get the battle
    const getBattleResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/battles/${battleId}`,
      player1.token
    )
    expect(getBattleResponse.status).toBe(200)
    expect(getBattleResponse.body).toHaveProperty('id', battleId)
    expect(getBattleResponse.body).toHaveProperty('initiator', character1Id)
    expect(getBattleResponse.body).toHaveProperty('participants')
    expect(getBattleResponse.body.participants).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: character1Id }),
        expect.objectContaining({ id: character2Id })
      ])
    )
  })
  it('should add a random monster to the battle', async () => {
    let monsterId = await TestUtils.getRandomMonster(app, player1.token)
    const addMonsterResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/battles/${battleId}/enemies`,
      player1.token,
      {
        monsterId
      }
    )
    expect(addMonsterResponse.status).toBe(201)
    // get the battle
    const getBattleResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/battles/${battleId}`,
      player1.token
    )
    expect(getBattleResponse.status).toBe(200)
    expect(getBattleResponse.body).toHaveProperty('id', battleId)
    expect(getBattleResponse.body).toHaveProperty('enemies')
    expect(getBattleResponse.body.enemies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ actionName: expect.any(String), actionValue: expect.any(Number) })
      ])
    )
  })
  it('should advance the round and verify the monster action changes', async () => {
    //get the monster's action name from the battle
    const getBattleResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/battles/${battleId}`,
      player1.token
    )
    expect(getBattleResponse.status).toBe(200)
    const monsterActionName = getBattleResponse.body.enemies[0].actionName
    //advance the round
    const advanceRoundResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/battles/${battleId}/nextround`,
      player1.token
    )
    expect(advanceRoundResponse.status).toBe(201)
    expect(advanceRoundResponse.body.enemies[0].actionName).not.toEqual(monsterActionName)
  })

  it('should delete the battle', async () => {
    const deleteBattleResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/games/${gameId}/battles/${battleId}`,
      player1.token
    )
    expect(deleteBattleResponse.status).toBe(200)
  })
})
