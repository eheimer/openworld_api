import { Test, TestingModule } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import request from 'supertest'
import { AppModule } from '../../src/app.module'
import { v4 as uuidv4 } from 'uuid'
import { APIUtils } from '../api/helpers/util'

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
    app = await APIUtils.createApp()
    player = await APIUtils.registerAndLoginPlayer(app)
    gameId = await APIUtils.createGameAsPlayer(app, player.token)
    character = await APIUtils.createCharacterAsPlayer(app, gameId, player.token)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should create a game and a character', async () => {
    // get character by id
    const characterResponse = await APIUtils.buildAuthorizedRequest(
      app,
      'get',
      `/characters/${character}`,
      player.token
    )
    expect(characterResponse.status).toBe(200)
    expect(characterResponse.body).toHaveProperty('id', character)
    expect(characterResponse.body).toHaveProperty('inventory')
    inventoryId = characterResponse.body.inventory.id
  })

  it('should manage inventory items', async () => {
    const getInventoryResponse = await request(app.getHttpServer())
      .get(`/inventory/${inventoryId}`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(getInventoryResponse.status).toBe(200)

    // Add armor and get its ID
    const addArmorResponse = await request(app.getHttpServer())
      .post(`/inventory/${inventoryId}/random`)
      .set('Authorization', `Bearer ${player.token}`)
      .send({ itemType: 'armor', level: 1 })
    expect(addArmorResponse.status).toBe(201)
    expect(addArmorResponse.body).toHaveProperty('armor')
    const armorId = addArmorResponse.body.armor[0].id

    // Add jewelry and get its ID
    const addJewelryResponse = await request(app.getHttpServer())
      .post(`/inventory/${inventoryId}/random`)
      .set('Authorization', `Bearer ${player.token}`)
      .send({ itemType: 'jewelry', level: 1 })
    expect(addJewelryResponse.status).toBe(201)
    expect(addJewelryResponse.body).toHaveProperty('jewelry')
    const jewelryId = addJewelryResponse.body.jewelry[0].id

    // Add weapon and get its ID
    const addWeaponResponse = await request(app.getHttpServer())
      .post(`/inventory/${inventoryId}/random`)
      .set('Authorization', `Bearer ${player.token}`)
      .send({ itemType: 'weapon', level: 1 })
    expect(addWeaponResponse.status).toBe(201)
    expect(addWeaponResponse.body).toHaveProperty('weapons')
    const weaponId = addWeaponResponse.body.weapons[0].id

    // Drop the jewelry item
    const dropItemResponse = await request(app.getHttpServer())
      .put(`/inventory/${inventoryId}/drop/jewelry/${jewelryId}`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(dropItemResponse.status).toBe(200)

    // Equip the armor
    const equipItemResponse = await request(app.getHttpServer())
      .put(`/inventory/${inventoryId}/equip/armor/${armorId}`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(equipItemResponse.status).toBe(200)

    // Unequip the weapon (first equip it)
    const equipWeaponResponse = await request(app.getHttpServer())
      .put(`/inventory/${inventoryId}/equip/weapon/${weaponId}`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(equipWeaponResponse.status).toBe(200)

    const unequipItemResponse = await request(app.getHttpServer())
      .put(`/inventory/${inventoryId}/unequip/weapon/${weaponId}`)
      .set('Authorization', `Bearer ${player.token}`)
    expect(unequipItemResponse.status).toBe(200)
  })
})
