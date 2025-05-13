import { INestApplication } from '@nestjs/common'
import { v4 as uuidv4 } from 'uuid'
import { buildRequest } from './util'

export async function registerAndLoginPlayer(app: INestApplication) {
  const username = `player_${uuidv4()}`
  const email = `${username}@example.com`

  const registerResponse = await buildRequest(app, 'post', '/auth/register').send({
    username,
    email,
    password: 'password'
  })

  if (registerResponse.status !== 201) {
    throw new Error('Failed to register player')
  }

  const id = registerResponse.body.id

  const loginResponse = await buildRequest(app, 'post', '/auth/login').send({
    username: username,
    password: 'password'
  })

  if (loginResponse.status !== 201) {
    throw new Error('Failed to login player')
  }

  const token = loginResponse.body.token

  return { id, username, email, token }
}
