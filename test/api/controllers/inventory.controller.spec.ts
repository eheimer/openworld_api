import { INestApplication } from '@nestjs/common'
import { buildAuthorizedRequest, createApp } from '../helpers/util'
import { registerAndLoginPlayer } from '../helpers/auth.helper'
import { createGame } from '../helpers/games.helper'
import { createCharacter } from '../helpers/characters.helper'
import { equipItem, fetchInventoryId, generateRandomItem } from '../helpers/inventory.helper'
import { generate } from 'rxjs'

describe('InventoryController (Integration)', () => {
  let app: INestApplication
  let player: { id: number; username: string; token: string }
  // let gameId: number
  // let characterId: number
  // let inventoryId: number

  beforeAll(async () => {
    app = await createApp()
    player = await registerAndLoginPlayer(app)
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET /inventory should return all inventories', async () => {
    const response = await buildAuthorizedRequest(app, 'get', '/inventory', player.token).send()

    expect(response.status).toBe(200)
    expect(Array.isArray(response.body)).toBe(true)
  })

  test('GET /inventory/:inventoryId should return a specific inventory', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const inventoryId = await fetchInventoryId(app, player.token, characterId)
    const response = await buildAuthorizedRequest(app, 'get', `/inventory/${inventoryId}`, player.token).send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('id', inventoryId)
  })

  test('POST /inventory/:inventoryId/random should add a random item to an inventory', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const inventoryId = await fetchInventoryId(app, player.token, characterId)

    const itemType = 'jewelry'
    // const response = await generateRandomItem(app, player.token, inventoryId, itemType, 5)
    const randomItemDto = { itemType, level: 5 }
    const response = await buildAuthorizedRequest(app, 'post', `/inventory/${inventoryId}/random`, player.token).send(
      randomItemDto
    )

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty(itemType)
    expect(response.body[itemType].length).toBeGreaterThan(0)
  })

  test('PUT /inventory/:inventoryId/equip/:itemType/:itemId should equip an item in an inventory', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const inventoryId = await fetchInventoryId(app, player.token, characterId)
    const itemType = 'weapon'
    const itemId = await generateRandomItem(app, player.token, inventoryId, itemType, 5)

    const response = await buildAuthorizedRequest(
      app,
      'put',
      `/inventory/${inventoryId}/equip/${itemType}/${itemId}`,
      player.token
    ).send()

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('equipped')
    expect(Array.isArray(response.body.equipped)).toBe(true)
    expect(response.body.equipped.length).toBe(1)
    expect(response.body.equipped[0]).toHaveProperty('id', itemId)
  })

  test('PUT /inventory/:inventoryId/unequip/:itemType/:itemId should unequip an item in an inventory', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const inventoryId = await fetchInventoryId(app, player.token, characterId)
    const itemType = 'armor'
    const itemId = await generateRandomItem(app, player.token, inventoryId, itemType, 5)
    await equipItem(app, player.token, inventoryId, itemType, itemId)

    const unequipResponse = await buildAuthorizedRequest(
      app,
      'put',
      `/inventory/${inventoryId}/unequip/${itemType}/${itemId}`,
      player.token
    ).send()

    expect(unequipResponse.status).toBe(200)
    expect(unequipResponse.body).toHaveProperty('equipped')
    expect(Array.isArray(unequipResponse.body.equipped)).toBe(true)
    expect(unequipResponse.body.equipped.length).toBe(0)
  })

  test('PUT /inventory/:inventoryId/drop/:itemType/:itemId should drop an item from an inventory', async () => {
    const gameId = await createGame(app, player.token)
    const characterId = await createCharacter(app, player.token, gameId)
    const inventoryId = await fetchInventoryId(app, player.token, characterId)
    const itemType = 'armor'
    const itemId = await generateRandomItem(app, player.token, inventoryId, itemType, 5)

    // Drop the item
    const dropResponse = await buildAuthorizedRequest(
      app,
      'put',
      `/inventory/${inventoryId}/drop/${itemType}/${itemId}`,
      player.token
    ).send()

    expect(dropResponse.status).toBe(200)

    // Verify the item is no longer in the inventory
    const inventoryResponse = await buildAuthorizedRequest(app, 'get', `/inventory/${inventoryId}`, player.token).send()

    expect(inventoryResponse.status).toBe(200)
    expect(inventoryResponse.body.armor).not.toContainEqual(expect.objectContaining({ id: itemId }))
  })
})
