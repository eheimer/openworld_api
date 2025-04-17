import { INestApplication } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { TestUtils } from './utils/test-utils'

describe('Player functionality (e2e)', () => {
  let app: INestApplication
  let player1: { playerId: number; username: string; token: string }
  let player2: { playerId: number; username: string; token: string }

  beforeAll(async () => {
    app = await TestUtils.createApp()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register and login PLAYER 1', async () => {
    const username = `player1_${uuidv4()}`
    const email = `player1_${uuidv4()}@example.com`

    const registerResponse = await TestUtils.buildRequest(app, 'post', '/auth/register', {
      username,
      email,
      password: 'password'
    })
    expect(registerResponse.status).toBe(201)
    expect(registerResponse.body).toHaveProperty('username', username)
    expect(registerResponse.body).toHaveProperty('email', email)

    player1 = {
      playerId: registerResponse.body.id,
      username: registerResponse.body.username,
      token: ''
    }

    const loginResponse = await TestUtils.buildRequest(app, 'post', '/auth/login', {
      username: player1.username,
      password: 'password'
    })
    expect(loginResponse.status).toBe(201)
    player1.token = loginResponse.body.token
  })

  it('should register and login PLAYER 2', async () => {
    const username = `player2_${uuidv4()}`
    const email = `player2_${uuidv4()}@example.com`

    const registerResponse = await TestUtils.buildRequest(app, 'post', '/auth/register', {
      username,
      email,
      password: 'password'
    })
    expect(registerResponse.status).toBe(201)
    expect(registerResponse.body).toHaveProperty('username', username)
    expect(registerResponse.body).toHaveProperty('email', email)

    player2 = {
      playerId: registerResponse.body.id,
      username: registerResponse.body.username,
      token: ''
    }

    const loginResponse = await TestUtils.buildRequest(app, 'post', '/auth/login', {
      username: player2.username,
      password: 'password'
    })
    expect(loginResponse.status).toBe(201)
    player2.token = loginResponse.body.token
  })

  it('should get all players', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/players', player1.token)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(1)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: player1.playerId, username: player1.username }),
        expect.objectContaining({ id: player2.playerId, username: player2.username })
      ])
    )
    // expect that when getting all players as player1, player 1 should have an email address, player 2 should NOT have an email address
    const player1Response = response.body.find((p) => p.id === player1.playerId)
    const player2Response = response.body.find((p) => p.id === player2.playerId)
    expect(player1Response).toHaveProperty('email')
    expect(player2Response).not.toHaveProperty('email')
  })

  it('PLAYER 1 should update PLAYER 1 email', async () => {
    const payload = { email: `updated_${player1.username}@example.com` }
    const response = await TestUtils.buildAuthorizedRequest(
      app,
      'patch',
      `/players/${player1.playerId}`,
      player1.token,
      payload
    )

    expect(response.status).toBe(200)
    expect(response.body.email).toBe(payload.email)
  })

  it('PLAYER 1 should fail to update PLAYER 2 email', async () => {
    const payload = { email: `updated_${player2.username}@example.com` }
    const response = await TestUtils.buildAuthorizedRequest(
      app,
      'patch',
      `/players/${player2.playerId}`,
      player1.token,
      payload
    )

    expect(response.status).toBe(403)
  })

  it('PLAYER 1 should fail to delete PLAYER 2', async () => {
    const response = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/players/${player2.playerId}`,
      player1.token
    )

    expect(response.status).toBe(403)
  })

  it('PLAYER 1 should delete PLAYER 1', async () => {
    const response = await TestUtils.buildAuthorizedRequest(
      app,
      'delete',
      `/players/${player1.playerId}`,
      player1.token
    )

    expect(response.status).toBe(200)
  })
})
