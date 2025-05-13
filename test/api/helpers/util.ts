import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { v4 as uuidv4 } from 'uuid'
import { Test, TestingModule } from '@nestjs/testing'
import { AppModule } from '../../../src/app.module'

export enum Method {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
}

export class TestUtils {
  static async createGameAsPlayer(app: INestApplication, playerToken: string): Promise<number> {
    const gameResponse = await buildAuthorizedRequest(app, 'post', '/games', playerToken, {
      name: `game ${uuidv4()}`
    })
    if (gameResponse.status !== 201) {
      throw new Error('Failed to create game')
    }
    return gameResponse.body.id
  }

  static async addPlayerToGame(app: INestApplication, gameId: number, playerId: number, playerToken: string) {
    const addPlayerResponse = await buildAuthorizedRequest(
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
    const characterResponse = await buildAuthorizedRequest(
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
    const raceResponse = await buildAuthorizedRequest(app, 'get', '/race', token)
    return raceResponse.body[Math.floor(Math.random() * raceResponse.body.length)].id
  }

  static async getRandomMonster(app: INestApplication, token: string): Promise<number> {
    const monsterResponse = await buildAuthorizedRequest(app, 'get', '/monsters', token)
    return monsterResponse.body[Math.floor(Math.random() * monsterResponse.body.length)].id
  }
}

export function authorizeRequest(requestBuilder: request.Test, token: string): request.Test {
  return requestBuilder.set('Authorization', `Bearer ${token}`)
}

export function buildRequest(app: INestApplication, method: string, endpoint: string, payload?: any): request.Test {
  const req = request(app.getHttpServer())[method](endpoint)
  return payload ? req.send(payload) : req
}

export function buildAuthorizedRequest(
  app: INestApplication,
  method: string,
  endpoint: string,
  token: string,
  payload?: any
): request.Test {
  const requestBuilder = buildRequest(app, method, endpoint, payload)
  return authorizeRequest(requestBuilder, token)
}

export function validateResponseStatus(response: any, expectedStatus: number): void {
  if (response.status !== expectedStatus) {
    //console.error(response.body?.message || 'Unexpected error')
    throw new Error(`Unexpected response: ${response.body?.message || response.status}`)
  }
  expect(response.status).toBe(expectedStatus)
}

export async function createApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule]
  }).compile()

  const app = moduleFixture.createNestApplication()
  await app.init()
  return app
}
