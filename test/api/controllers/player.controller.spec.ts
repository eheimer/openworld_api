import { INestApplication } from '@nestjs/common'
import { buildAuthorizedRequest, buildRequest, createApp } from '../helpers/util'
import { registerAndLoginPlayer } from '../helpers/auth.helper'

describe('PlayersController (Integration)', () => {
  let app: INestApplication
  let player1: { id: number; username: string; token: string }

  beforeAll(async () => {
    app = await createApp()
    player1 = await registerAndLoginPlayer(app)
    await registerAndLoginPlayer(app)
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET /players should return 201 and array of all players.  Only current player should have an email address', async () => {
    const response = await buildAuthorizedRequest(app, 'get', '/players', player1.token)
    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
    expect(response.body.length).toBeGreaterThan(1)

    response.body.forEach((player) => {
      expect(player).toHaveProperty('id')
      expect(player).toHaveProperty('username')
      if (player.id === player1.id) {
        expect(player).toHaveProperty('email')
      } else {
        expect(player).not.toHaveProperty('email')
      }
    })
  })

  test('GET /players/:id should return 200 and serialized response', async () => {
    const response = await buildAuthorizedRequest(app, 'get', `/players/${player1.id}`, player1.token)
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', player1.id)
    expect(response.body).toHaveProperty('username', player1.username)
    expect(response.body).toHaveProperty('email')
  })

  test('PATCH /players/:id should return 200 and serialized response', async () => {
    const newUsername = `new_${player1.username}`
    const response = await buildAuthorizedRequest(app, 'patch', `/players/${player1.id}`, player1.token).send({
      username: newUsername
    })
    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', player1.id)
    expect(response.body).toHaveProperty('username', newUsername)
  })

  test('DELETE /players/:id should return 200 and serialized response', async () => {
    const response = await buildAuthorizedRequest(app, 'delete', `/players/${player1.id}`, player1.token)
    expect(response.status).toBe(200)

    // Check that the player is no longer in the database
    const getResponse = await buildAuthorizedRequest(app, 'get', `/players/${player1.id}`, player1.token)
    expect(getResponse.status).toBe(404)
    expect(getResponse.body).toHaveProperty('message', 'User not found')
  })
})
