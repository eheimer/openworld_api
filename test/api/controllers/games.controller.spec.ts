import { INestApplication } from '@nestjs/common'
import { APIUtils } from '../helpers/util'
import { registerAndLoginPlayer } from '../helpers/auth.helper'
import { addPlayerToGame, createGame } from '../helpers/games.helper'
import { createCharacter } from '../helpers/characters.helper'
import { v4 as uuidv4 } from 'uuid'

describe('GamesController (Integration)', () => {
  let app: INestApplication
  let player: { id: number; username: string; token: string }
  let createdGameId: number
  let testGameName: string

  beforeAll(async () => {
    app = await APIUtils.createApp()
    player = await registerAndLoginPlayer(app)
    testGameName = `Test Game ${uuidv4()}`
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST /games should create a new game', async () => {
    const createGameDto = { name: testGameName }
    const response = await APIUtils.buildAuthorizedRequest(app, 'post', '/games', player.token).send(createGameDto)

    APIUtils.validateResponseStatus(response, 201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name', testGameName)
    createdGameId = response.body.id
  })

  test('GET /games should return all games for the current player', async () => {
    const response = await APIUtils.buildAuthorizedRequest(app, 'get', '/games', player.token).send()

    APIUtils.validateResponseStatus(response, 200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  test('GET /games/:gameId should return a specific game', async () => {
    const response = await APIUtils.buildAuthorizedRequest(app, 'get', `/games/${createdGameId}`, player.token).send()

    APIUtils.validateResponseStatus(response, 200)
    expect(response.body).toHaveProperty('id', createdGameId)
    expect(response.body).toHaveProperty('name', testGameName)
  })

  test('PATCH /games/:gameId should update a game', async () => {
    const updateGameDto = { name: 'Updated Game' }
    const response = await APIUtils.buildAuthorizedRequest(app, 'patch', `/games/${createdGameId}`, player.token).send(
      updateGameDto
    )

    APIUtils.validateResponseStatus(response, 200)
    expect(response.body).toHaveProperty('id', createdGameId)
    expect(response.body).toHaveProperty('name', 'Updated Game')
  })

  test('DELETE /games/:gameId should remove a game', async () => {
    const response = await APIUtils.buildAuthorizedRequest(app, 'delete', `/games/${createdGameId}`, player.token).send()

    APIUtils.validateResponseStatus(response, 200)
    //try to retrieve the game and verify a 404
    const getGameResponse = await APIUtils.buildAuthorizedRequest(app, 'get', `/games/${createdGameId}`, player.token).send()

    APIUtils.validateResponseStatus(getGameResponse, 404)

    expect(getGameResponse.status).toBe(404)
  })

  test('POST /games/:gameId/players/:playerId should add a player to a game', async () => {
    const gameId = await createGame(app, player.token)
    const newPlayer = await registerAndLoginPlayer(app)
    const response = await APIUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/players/${newPlayer.id}`,
      player.token
    ).send()

    APIUtils.validateResponseStatus(response, 201)
    expect(response.body).toHaveProperty('id', gameId)
    expect(response.body.players).toContainEqual(expect.objectContaining({ id: newPlayer.id }))
  })

  test('DELETE /games/:gameId/players/:playerId should remove a player from a game', async () => {
    const gameId = await createGame(app, player.token)
    const newPlayer = await registerAndLoginPlayer(app)
    await addPlayerToGame(app, player.token, gameId, newPlayer.id)

    const response = await APIUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/games/${gameId}/players/${newPlayer.id}`,
      player.token
    ).send()
    APIUtils.validateResponseStatus(response, 200)
    expect(response.body).toHaveProperty('id', gameId)
    expect(response.body.players).not.toContainEqual(expect.objectContaining({ id: newPlayer.id }))
  })

  test('POST /games/:gameId/characters should create a character for a game', async () => {
    const gameId = await createGame(app, player.token)
    const createCharacterDto = {
      name: 'Test Character',
      strength: 10,
      dexterity: 10,
      intelligence: 10,
      raceId: 1
    }
    const response = await APIUtils.buildAuthorizedRequest(app, 'post', `/games/${gameId}/characters`, player.token).send(
      createCharacterDto
    )
    APIUtils.validateResponseStatus(response, 201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).toHaveProperty('name', 'Test Character')
  })

  test('GET /games/:gameId/characters should return all characters for a game', async () => {
    const gameId = await createGame(app, player.token)
    const player2 = await registerAndLoginPlayer(app)
    await addPlayerToGame(app, player.token, gameId, player2.id)
    const char1 = await createCharacter(app, player.token, gameId)
    const char2 = await createCharacter(app, player2.token, gameId)
    const response = await APIUtils.buildAuthorizedRequest(app, 'get', `/games/${gameId}/characters`, player.token).send()

    APIUtils.validateResponseStatus(response, 200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: char1,
        game: expect.objectContaining({
          id: gameId
        }),
        player: expect.objectContaining({ id: player.id })
      })
    )
    expect(response.body).toContainEqual(
      expect.objectContaining({
        id: char2,
        game: expect.objectContaining({
          id: gameId
        }),
        player: expect.objectContaining({ id: player2.id })
      })
    )
  })
})
