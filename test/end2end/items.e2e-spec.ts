import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { v4 as uuidv4 } from 'uuid'
import { TestUtils } from '../api/helpers/util'

// issue the following command to run this test:
// npx jest --config ./test/jest-e2e.json test/items.e2e-spec.ts

//TODO: this test fails because character creation does not create an inventory

describe('ItemsController (e2e)', () => {
  let app: INestApplication
  let player: { playerId: number; username: string; token: string }
  let gameId: number
  let character: number
  let inventoryId: number

  beforeAll(async () => {
    app = await TestUtils.createApp()
    player = await TestUtils.registerAndLoginPlayer(app)
    gameId = await TestUtils.createGameAsPlayer(app, player.token)
    character = await TestUtils.createCharacterAsPlayer(app, gameId, player.token)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a game and a character', async () => {
    // get character by id
    const characterResponse = await TestUtils.buildAuthorizedRequest(
      app,
      'get',
      `/characters/${character}`,
      player.token
    )
    expect(characterResponse.status).toBe(200)
    expect(characterResponse.body).toHaveProperty('id', characterId)
    expect(characterResponse.body).toHaveProperty('inventory')
    inventoryId = characterResponse.body.inventory.id
  })

  it('should manage inventory items', async () => {
    const getInventoryResponse = await request(app.getHttpServer())
      .get(`/inventory/${inventoryId}`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(getInventoryResponse.status).toBe(200)

    const addItemResponse = await request(app.getHttpServer())
      .post(`/inventory/${inventoryId}/random`)
      .set('Authorization', `Bearer ${player.token}`)
      .send({ itemType: 'armor', level: 1 })
    expect(addItemResponse.status).toBe(201)

    const dropItemResponse = await request(app.getHttpServer())
      .put(`/inventory/${inventoryId}/drop/jewelry/12`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(dropItemResponse.status).toBe(200)

    const equipItemResponse = await request(app.getHttpServer())
      .put(`/inventory/${inventoryId}/equip/armor/1`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(equipItemResponse.status).toBe(200)

    const unequipItemResponse = await request(app.getHttpServer())
      .put(`/inventory/${inventoryId}/unequip/weapon/2`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(unequipItemResponse.status).toBe(200)
  })
})
