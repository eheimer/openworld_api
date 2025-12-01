import { INestApplication } from '@nestjs/common'
import { APIUtils } from './util'
import { InventoryDto } from '../../../src/items/dto/inventory.dto'

export async function fetchInventoryId(
  app: INestApplication,
  playerToken: string,
  characterId: number
): Promise<number> {
  const characterResponse = await APIUtils.buildAuthorizedRequest(app, 'get', `/characters/${characterId}`, playerToken).send()
  return characterResponse.body.inventory.id
}

export async function generateRandomItem(
  app: INestApplication,
  playerToken: string,
  inventoryId: number,
  itemType: string,
  level: number
): Promise<number> {
  const randomItemDto = { itemType, level }
  const addItemResponse = await APIUtils.buildAuthorizedRequest(
    app,
    'post',
    `/inventory/${inventoryId}/random`,
    playerToken
  ).send(randomItemDto)

  if (itemType === 'weapon') {
    itemType = 'weapons'
  }

  return addItemResponse.body[itemType][0].id
}

export async function equipItem(
  app: INestApplication,
  playerToken: string,
  inventoryId: number,
  itemType: string,
  itemId: number
): Promise<void> {
  const equipResponse = await APIUtils.buildAuthorizedRequest(
    app,
    'put',
    `/inventory/${inventoryId}/equip/${itemType}/${itemId}`,
    playerToken
  ).send()

  if (equipResponse.status !== 200) {
    throw new Error(`Failed to equip item with id ${itemId}`)
  }
}

export async function unequipItem(
  app: INestApplication,
  playerToken: string,
  inventoryId: number,
  itemType: string,
  itemId: number
): Promise<void> {
  const unequipResponse = await APIUtils.buildAuthorizedRequest(
    app,
    'put',
    `/inventory/${inventoryId}/unequip/${itemType}/${itemId}`,
    playerToken
  ).send()

  if (unequipResponse.status !== 200) {
    throw new Error(`Failed to unequip item with id ${itemId}`)
  }
}
