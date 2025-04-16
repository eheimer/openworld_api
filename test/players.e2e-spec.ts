import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { v4 as uuidv4 } from 'uuid'

/*
 This file tests that players can be registered and logged in,
 and that the player can update their own email address
 and delete their own account.
 It also tests that the player cannot update or delete another player's account
*/

describe('PlayersController (e2e)', () => {
  let app: INestApplication
  let player1Token: string
  let player1Id: number
  let player1Username: string
  let player2Id: number
  let player2Username: string

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

  it('should register PLAYER 1', async () => {
    player1Username = `player_${uuidv4()}`
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: `${player1Username}`,
        email: `${player1Username}@example.com`,
        password: 'password'
      })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    player1Id = response.body.id
  })

  it('should register PLAYER 2', async () => {
    player2Username = `player_${uuidv4()}`
    const response = await request(app.getHttpServer())
      .post('/auth/register')
      .send({
        username: `${player2Username}`,
        email: `${player2Username}@example.com`,
        password: 'password'
      })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    player2Id = response.body.id
  })

  it('should login PLAYER 1', async () => {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        username: `${player1Username}`,
        password: 'password'
      })
    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('token')
    player1Token = response.body.token
  })

  it('should get all players', async () => {
    const response = await request(app.getHttpServer()).get('/players').set('Authorization', `Bearer ${player1Token}`)

    expect(response.status).toBe(200)
    expect(response.body).toBeInstanceOf(Array)
    expect(response.body.length).toBeGreaterThan(1)
    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: player1Id, username: player1Username }),
        expect.objectContaining({ id: player2Id, username: player2Username })
      ])
    )
  })

  it('should update PLAYER 1 email', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/players/${player1Id}`)
      .set('Authorization', `Bearer ${player1Token}`)
      .send({ email: `updated_${player1Username}@example.com` })

    expect(response.status).toBe(200)
    expect(response.body.email).toBe(`updated_${player1Username}@example.com`)
  })

  it('should fail to update PLAYER 2 email', async () => {
    const response = await request(app.getHttpServer())
      .patch(`/players/${player2Id}`)
      .set('Authorization', `Bearer ${player1Token}`)
      .send({ email: `updated_${player2Username}@example.com` })

    expect(response.status).toBe(403)
  })

  it('should fail to delete PLAYER 2', async () => {
    const response = await request(app.getHttpServer())
      .delete(`/players/${player2Id}`)
      .set('Authorization', `Bearer ${player1Token}`)

    expect(response.status).toBe(403)
  })

  it('should logout PLAYER 1', async () => {
    const response = await request(app.getHttpServer())
      .get('/auth/logout')
      .set('Authorization', `Bearer ${player1Token}`)

    expect(response.status).toBe(200)
  })
})
