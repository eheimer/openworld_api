import { INestApplication } from '@nestjs/common'
import { CreatePlayerDto } from '../../../src/players/dto/create-player.dto'
import { PlayerDetailDto } from '../../../src/players/dto/player-detail.dto'
import { LoginDto } from '../../../src/auth/dto/login.dto'
import { APIUtils } from '../helpers/util'
import { v4 as uuidv4 } from 'uuid'

describe('AuthController (Integration)', () => {
  let app: INestApplication
  let id: number
  let username: string = `player_${uuidv4()}`
  let password: string = 'password123'
  const email: string = `${username}@example.com`

  beforeAll(async () => {
    app = await APIUtils.createApp()
  })

  afterAll(async () => {
    await app.close()
  })

  test('POST /auth/register should return 201 and serialized response', async () => {
    const createPlayerDto: CreatePlayerDto = { username, password, email }
    const response = await APIUtils.buildRequest(app, 'post', '/auth/register').send(createPlayerDto)

    if (response.status !== 201) {
      throw new Error(`Unexpected response: ${JSON.stringify(response.body)}`)
    }
    expect(response.status).toBe(201)

    const body: PlayerDetailDto = response.body
    expect(body).toHaveProperty('id')
    id = body.id
    expect(body).toHaveProperty('username', username)
    expect(body).toHaveProperty('email', email)
  })

  test('POST /auth/login should return 201 and a valid token', async () => {
    const loginDto: LoginDto = { username, password }
    const response = await APIUtils.buildRequest(app, 'post', '/auth/login').send(loginDto)

    if (response.status !== 201) {
      throw new Error(`Unexpected response: ${JSON.stringify(response.body)}`)
    }
    expect(response.status).toBe(201)

    expect(response.body).toHaveProperty('token')
    expect(typeof response.body.token).toBe('string')
    expect(response.body).toHaveProperty('player', id)
  })
})
