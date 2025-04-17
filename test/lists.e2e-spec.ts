import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import * as request from 'supertest'
import { AppModule } from './../src/app.module'
import { v4 as uuidv4 } from 'uuid'
import { TestUtils } from './utils/test-utils'

describe('Lists (e2e)', () => {
  let app: INestApplication
  let player: { playerId: number; username: string; token: string }

  beforeAll(async () => {
    app = await TestUtils.createApp()
    player = await TestUtils.registerAndLoginPlayer(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should retrieve the conditions list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/conditions', player.token)
    expect(response.status).toBe(200)
  })

  it('should retrieve the inventory list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/inventory', player.token)
    expect(response.status).toBe(200)
  })

  it('should retrieve the weapons list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/weapons', player.token)
    expect(response.status).toBe(200)
  })

  it('should retrieve the armors list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/armor', player.token)
    expect(response.status).toBe(200)
  })

  it('should retrieve the jewelry list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/jewelry', player.token)
    expect(response.status).toBe(200)
  })

  it('should retrieve the monsters list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/monsters', player.token)
    expect(response.status).toBe(200)
  })

  it('should retrieve the skills list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/skills', player.token)
    expect(response.status).toBe(200)
  })

  it('should retrieve the races list', async () => {
    const response = await TestUtils.buildAuthorizedRequest(app, 'get', '/race', player.token)
    expect(response.status).toBe(200)
  })
})
