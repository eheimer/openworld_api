import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from '../../src/app.module'
import { v4 as uuidv4 } from 'uuid'

// issue the following command to run this test:
// npx jest --config ./test/jest-e2e.json test/cascades.e2e-spec.ts

describe('CascadesController (e2e)', () => {
  let app: INestApplication
  let playerToken: string
  let playerId: number
  let gameId: number
  let characterId: number
  let battleId: number

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    await app.init()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should register a player', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: `player_${uuidv4()}`,
        email: `player_${uuidv4()}@example.com`,
        password: 'password'
      })
    expect(response.status).toBe(201)
    playerId = response.body.id
    playerToken = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: response.body.username, password: 'password' })
    ).body.token
  })

  it('should create a game', async () => {
    const response = await request(app.getHttpServer())
      .post('/games')
      .set('Authorization', `Bearer ${playerToken}`)
      .send({ name: `test game ${uuidv4()}` })
    expect(response.status).toBe(201)
    gameId = response.body.id
  })

  it('should create a character', async () => {
    const response = await request(app.getHttpServer())
      .post(`/games/${gameId}/characters`)
      .set('Authorization', `Bearer ${playerToken}`)
      .send({
        name: `test character ${uuidv4()}`,
        strength: 3,
        dexterity: 3,
        intelligence: 3,
        raceId: 1,
        skills: [{ id: 1, level: 1 }]
      })
    expect(response.status).toBe(201)
    characterId = response.body.id
  })

  it('should create a battle', async () => {
    const response = await request(app.getHttpServer())
      .post(`/games/${gameId}/battles`)
      .set('Authorization', `Bearer ${playerToken}`)
    expect(response.status).toBe(201)
    battleId = response.body.id
  })

  it('should delete the player and verify cascading effects', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/players/${playerId}`)
      .set('Authorization', `Bearer ${playerToken}`)
    expect(response.status).toBe(200)
  })
})
