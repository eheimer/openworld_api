import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../../src/app.module'

// API prefix constant for consistent path construction
export const API_PREFIX = '/api'

export enum Method {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
}

export class APIUtils {
  static async createApp(): Promise<INestApplication> {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    const app = moduleFixture.createNestApplication()
    // Configure global API prefix to match production configuration
    app.setGlobalPrefix('api')
    await app.init()
    return app
  }

  static buildRequest(app: INestApplication, method: string, endpoint: string, payload?: any): request.Test {
    // Prepend API prefix to all endpoint paths
    const prefixedEndpoint = `${API_PREFIX}${endpoint}`
    const req = request(app.getHttpServer())[method](prefixedEndpoint)
    return payload ? req.send(payload) : req
  }

  static authorizeRequest(requestBuilder: request.Test, token: string): request.Test {
    return requestBuilder.set('Authorization', `Bearer ${token}`)
  }

  static buildAuthorizedRequest(
    app: INestApplication,
    method: string,
    endpoint: string,
    token: string,
    payload?: any
  ): request.Test {
    const requestBuilder = APIUtils.buildRequest(app, method, endpoint, payload)
    return APIUtils.authorizeRequest(requestBuilder, token)
  }

  static validateResponseStatus(response: any, expectedStatus: number): void {
    if (response.status !== expectedStatus) {
      throw new Error(`Unexpected response: ${response.body?.message || response.status}`)
    }
    expect(response.status).toBe(expectedStatus)
  }

  static async registerAndLoginPlayer(
    app: INestApplication
  ): Promise<{ playerId: number; username: string; token: string }> {
    const username = `player_${uuidv4()}`
    const email = `${username}@example.com`

    const registerResponse = await APIUtils.buildRequest(app, 'post', '/auth/register', {
      username,
      email,
      password: 'password'
    })

    if (registerResponse.status !== 201) {
      throw new Error(`Failed to register player: ${JSON.stringify(registerResponse.body)}`)
    }

    const loginResponse = await APIUtils.buildRequest(app, 'post', '/auth/login', {
      username,
      password: 'password'
    })

    if (loginResponse.status !== 201) {
      throw new Error(`Failed to login player: ${JSON.stringify(loginResponse.body)}`)
    }

    return {
      playerId: registerResponse.body.id,
      username: registerResponse.body.username,
      token: loginResponse.body.token
    }
  }

  static async createGameAsPlayer(app: INestApplication, playerToken: string): Promise<number> {
    const gameResponse = await APIUtils.buildAuthorizedRequest(app, 'post', '/games', playerToken, {
      name: `game ${uuidv4()}`
    })
    if (gameResponse.status !== 201) {
      throw new Error('Failed to create game')
    }
    return gameResponse.body.id
  }

  static async addPlayerToGame(app: INestApplication, gameId: number, playerId: number, playerToken: string) {
    const addPlayerResponse = await APIUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/players/${playerId}`,
      playerToken
    )
    if (addPlayerResponse.status !== 201) {
      throw new Error('Failed to add player to game')
    }
    return addPlayerResponse.body.id
  }

  static async createCharacterAsPlayer(app: INestApplication, gameId: number, playerToken: string) {
    let raceId = await this.getRandomRace(app, playerToken)
    let characterName = `character ${uuidv4()}`
    let payload = {
      name: characterName,
      strength: 3,
      dexterity: 3,
      intelligence: 3,
      raceId: raceId,
      skills: []
    }
    const characterResponse = await APIUtils.buildAuthorizedRequest(
      app,
      'post',
      `/games/${gameId}/characters`,
      playerToken,
      payload
    )
    if (characterResponse.status !== 201) {
      throw new Error('Failed to create character')
    }
    return characterResponse.body.id
  }

  static async getRandomRace(app: INestApplication, token: string): Promise<number> {
    const raceResponse = await APIUtils.buildAuthorizedRequest(app, 'get', '/race', token)
    return raceResponse.body[Math.floor(Math.random() * raceResponse.body.length)].id
  }

  static async getRandomMonster(app: INestApplication, token: string): Promise<number> {
    const monsterResponse = await APIUtils.buildAuthorizedRequest(app, 'get', '/monsters', token)
    return monsterResponse.body[Math.floor(Math.random() * monsterResponse.body.length)].id
  }
}

// Keep TestUtils as an alias for backward compatibility with any external code
export const TestUtils = APIUtils
