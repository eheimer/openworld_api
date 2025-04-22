import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { v4 as uuidv4 } from 'uuid'

// issue the following command to run this test:
// npx jest --config ./test/jest-e2e.json test/game-delete-player.e2e-spec.ts

describe('GameDeletePlayerController (e2e)', () => {
  let app: INestApplication
  let player1Token: string
  let player2Token: string
  let player1Id: number
  let player2Id: number
  let gameId: number

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

  it('should register PLAYER 1 and PLAYER 2', async () => {
    const player1Response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: `player1_${uuidv4()}`,
        email: `player1_${uuidv4()}@example.com`,
        password: 'password'
      })
    expect(player1Response.status).toBe(201)
    player1Id = player1Response.body.id
    player1Token = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: player1Response.body.username, password: 'password' })
    ).body.token

    const player2Response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: `player2_${uuidv4()}`,
        email: `player2_${uuidv4()}@example.com`,
        password: 'password'
      })
    expect(player2Response.status).toBe(201)
    player2Id = player2Response.body.id
    player2Token = (
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({ username: player2Response.body.username, password: 'password' })
    ).body.token
  })

  it('should create a game and transfer ownership on player deletion', async () => {
    const gameResponse = await request(app.getHttpServer())
      .post('/games')
      .set('Authorization', `Bearer ${player1Token}`)
      .send({ name: `test game ${uuidv4()}` })
    expect(gameResponse.status).toBe(201)
    gameId = gameResponse.body.id

    const addPlayerResponse = await request(app.getHttpServer())
      .post(`/games/${gameId}/players/${player2Id}`)
      .set('Authorization', `Bearer ${player1Token}`)
    expect(addPlayerResponse.status).toBe(201)

    const deletePlayerResponse = await request(app.getHttpServer())
      .delete(`/players/${player1Id}`)
      .set('Authorization', `Bearer ${player1Token}`)
    expect(deletePlayerResponse.status).toBe(200)

    const verifyOwnershipResponse = await request(app.getHttpServer())
      .get(`/games/${gameId}`)
      .set('Authorization', `Bearer ${player2Token}`)
    expect(verifyOwnershipResponse.status).toBe(200)
    expect(verifyOwnershipResponse.body.ownerId).toBe(player2Id)
  })
})
