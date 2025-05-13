import { INestApplication } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { TestUtils } from '../utils/test-utils'

describe('GamesController (e2e)', () => {
  let app: INestApplication
  let player1: { playerId: number; username: string; token: string }
  let player2: { playerId: number; username: string; token: string }
  let game: { id: number; name: string }

  beforeAll(async () => {
    app = await TestUtils.createApp()
    player1 = await TestUtils.registerAndLoginPlayer(app)
    player2 = await TestUtils.registerAndLoginPlayer(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a game', async () => {
    game = { id: 0, name: `game ${uuidv4()}` }
    const response = await TestUtils.buildAuthorizedRequest(app, 'post', '/games', player1.token, {
      name: game.name
    })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('name')
    expect(response.body.name).toBe(game.name)
    expect(response.body).toHaveProperty('owner')
    expect(response.body.owner).toHaveProperty('username')
    expect(response.body.owner.username).toBe(player1.username)
    expect(response.body).toHaveProperty('id')
    game.id = response.body.id
  })

  it('should get all games', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/games', player1.token)
    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ game: expect.objectContaining({ id: game.id, name: game.name }), owner: true })
      ])
    )
  })

  it('should get a game by id', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', `/games/${game.id}`, player1.token)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toBe(game.id)
  })

  it('should update a game name', async () => {
    const updatedGameName = `updated ${game.name}`
    const response = await TestUtils.buildAuthorizedRequest(app, 'patch', `/games/${game.id}`, player1.token, {
      name: updatedGameName
    })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('name')
    expect(response.body.name).toBe(updatedGameName)
    game.name = updatedGameName
  })

  it('should delete a game', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'delete', `/games/${game.id}`, player1.token)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('name')
    expect(response.body.name).toBe(game.name)
  })

  it('should create a new game and add PLAYER 2 to the game', async () => {
    game.id = await TestUtils.createGameAsPlayer(app, player1.token)
    const response = await TestUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${game.id}/players/${player2.playerId}`,
      player1.token
    )
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toBe(game.id)
    expect(response.body).toHaveProperty('players')
    expect(response.body.players).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: player2.playerId }),
        expect.objectContaining({ id: player1.playerId, username: player1.username })
      ])
    )
  })

  it('should get the game and verify PLAYER 2 is in the game', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', `/games/${game.id}`, player1.token)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toBe(game.id)
    expect(response.body.players).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: player2.playerId, username: player2.username })])
    )
  })

  it('should remove PLAYER 2 from the game', async () => {
    const response = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/games/${game.id}/players/${player2.playerId}`,
      player1.token
    )
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toBe(game.id)
    expect(response.body).toHaveProperty('players')
    expect(response.body.players).toEqual(
      expect.arrayContaining([expect.objectContaining({ id: player1.playerId, username: player1.username })])
    )
    expect(response.body.players).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: player2.playerId })])
    )
  })

  it('should get the game and verify PLAYER 2 is not in the game', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', `/games/${game.id}`, player1.token)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toBe(game.id)
    expect(response.body.players).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ id: player2.playerId })])
    )
  })

  it('should fail to delete the game as PLAYER 2', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'delete', `/games/${game.id}`, player2.token)
    expect(response.status).toBe(403)
  })
})
