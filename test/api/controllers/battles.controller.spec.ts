import { INestApplication } from '@nestjs/common'
import { APIUtils } from '../helpers/util'
import { registerAndLoginPlayer } from '../helpers/auth.helper'
import { addPlayerToGame, createGame } from '../helpers/games.helper'
import { createCharacter } from '../helpers/characters.helper'
import { createBattle } from '../helpers/battles.helper'

describe('BattlesController (Integration)', () => {
  let app: INestApplication
  let player: { id: number; username: string; token: string }

  beforeAll(async () => {
    app = await APIUtils.createApp()
    player = await registerAndLoginPlayer(app)
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET /games/:gameId/battles should return all battles for a game', async () => {
    const gameId = await createGame(app, player.token)
    const response = await APIUtils.buildAuthorizedRequest(app, 'get', `/games/${gameId}/battles`, player.token).send()

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  test('POST /games/:gameId/battles should create a new battle', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const battleId = await createBattle(app, player.token, gameId)

    expect(battleId).toBeDefined()
  })

  test('GET /games/:gameId/battles/:battleId should return a specific battle', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const battleId = await createBattle(app, player.token, gameId)

    const response = await APIUtils.buildAuthorizedRequest(
      app,
      'get',
      `/games/${gameId}/battles/${battleId}`,
      player.token
    ).send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', battleId)
  })

  test('DELETE /games/:gameId/battles/:battleId should delete a battle', async () => {
    const gameId = await createGame(app, player.token)
    await createCharacter(app, player.token, gameId)
    const battleId = await createBattle(app, player.token, gameId)

    const response = await APIUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/games/${gameId}/battles/${battleId}`,
      player.token
    ).send()

    expect(response.status).toBe(200)
  })

  test('POST /games/:gameId/battles/:battleId/join should allow a player to join a battle', async () => {
    const gameId = await createGame(app, player.token)
    await createCharacter(app, player.token, gameId)
    const battleId = await createBattle(app, player.token, gameId)
    const player2 = await registerAndLoginPlayer(app)
    await addPlayerToGame(app, player.token, gameId, player2.id)
    await createCharacter(app, player2.token, gameId)

    const response = await APIUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/battles/${battleId}/join`,
      player2.token
    ).send()

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id', battleId)
  })

  test('POST /games/:gameId/battles/:battleId/enemies should add a monster to a battle', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const battleId = await createBattle(app, player.token, gameId)

    const createMonsterDto = { monsterId: 1 }
    const response = await APIUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/battles/${battleId}/enemies`,
      player.token
    ).send(createMonsterDto)

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('monsterId')
  })

  test('POST /games/:gameId/battles/:battleId/nextround should progress the battle to the next round', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const battleId = await createBattle(app, player.token, gameId)

    const response = await APIUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/battles/${battleId}/nextround`,
      player.token
    ).send()

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id', battleId)
    expect(response.body).toHaveProperty('round', 2)
  })
})
