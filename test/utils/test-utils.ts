import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from './../../src/app.module'

export enum Method {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
}

export class TestUtils {
  static async registerAndLoginPlayer(app: INestApplication) {
    const username = `player_${uuidv4()}`

    const registerResponse = await this.buildRequest(app, 'post', '/auth/register').send({
      username: username,
      email: `${username}@example.com`,
      password: 'password'
    })

    if (registerResponse.status !== 201) {
      throw new Error('Failed to register player')
    }

    const playerId = registerResponse.body.id

    const loginResponse = await this.buildRequest(app, 'post', '/auth/login').send({
      username: username,
      password: 'password'
    })

    if (loginResponse.status !== 201) {
      throw new Error('Failed to login player')
    }

    const token = loginResponse.body.token

    return { playerId, username, token }
  }

  static async createGameAsPlayer(app: INestApplication, playerToken: string) {
    const gameResponse = await this.buildAuthorizedRequest(app, 'post', '/games', playerToken, {
      name: `test game ${uuidv4()}`
    })
    if (gameResponse.status !== 201) {
      throw new Error('Failed to create game')
    }
    return gameResponse.body
  }

  static authorizeRequest(requestBuilder: request.Test, token: string): request.Test {
    return requestBuilder.set('Authorization', `Bearer ${token}`)
  }

  static buildRequest(app: INestApplication, method: string, endpoint: string, payload?: any): request.Test {
    const req = request(app.getHttpServer())[method](endpoint)
    return payload ? req.send(payload) : req
  }

  static buildAuthorizedRequest(
    app: INestApplication,
    method: string,
    endpoint: string,
    token: string,
    payload?: any
  ): request.Test {
    const requestBuilder = this.buildRequest(app, method, endpoint, payload)
    return this.authorizeRequest(requestBuilder, token)
  }

  static async createApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    const app = moduleFixture.createNestApplication()
    await app.init()
    return app
  }
}
