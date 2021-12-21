import { DeepPartial } from 'typeorm'

import logger from '../../utils/logger'
import { CharacterFactory } from '../factories/CharacterFactory'
import { GameFactory } from '../factories/GameFactory'
import { InventoryFactory } from '../factories/InventoryFactory'
import { UserFactory } from '../factories/UserFactory'
import Character from '../models/Character'

const factory: CharacterFactory = new CharacterFactory()

async function createCharacter(
  name: string,
  maxHp: number,
  baseResist: number,
  inventorySize: number,
  playerId: number | string,
  gameId: number | string
): Promise<{ characterId: number | string }> {
  try {
    const player = await new UserFactory().getRepository().findOne(playerId)
    const game = await new GameFactory().getRepository().findOne(gameId)
    const inventory = await new InventoryFactory().create({
      gold: 0,
      capacity: inventorySize,
      limit: false
    })
    const character = await factory.create({
      name,
      maxHp,
      hp: maxHp,
      baseResist,
      resistC: baseResist,
      resistE: baseResist,
      resistF: baseResist,
      resistP: baseResist,
      resistPh: baseResist,
      player,
      game,
      inventory
    })
    return { characterId: character.id }
  } catch (err) {
    logger.error(`createCharacter: ${err}`)
    throw err
  }
}

async function updateCharacter(characterId: number | string, part: DeepPartial<Character>): Promise<void> {
  try {
    if (part.baseResist) {
      part.resistC = part.baseResist
      part.resistE = part.baseResist
      part.resistF = part.baseResist
      part.resistP = part.baseResist
      part.resistPh = part.baseResist
    }
    await factory.getRepository().update(characterId, part)
  } catch (err) {
    logger.error(`updateCharacter: ${err}`)
    throw err
  }
}

async function getCharacter(characterId: number | string): Promise<Character> {
  try {
    return await factory.getRepository().findOne(characterId, {
      relations: ['inventory'],
      loadRelationIds: { relations: ['player'] }
    })
  } catch (err) {
    logger.error(`getCharacter: ${err}`)
    throw err
  }
}

async function deleteCharacter(characterId: number | string): Promise<void> {
  try {
    const character = await factory
      .getRepository()
      .findOne(characterId, { loadRelationIds: { relations: ['inventory'] } })
    if (character) {
      await factory.getRepository().delete(characterId)
      //TODO: this should use the InventoryService so that it can ensure all of the items are deleted as well
      await new InventoryFactory().getRepository().delete(character.inventory)
    }
  } catch (err) {
    logger.error(`deleteCharacter: ${err}`)
    throw err
  }
}

/**
 * Validate that character belongs to player
 *
 * @param characterId
 * @param playerId
 */
async function authorizePlayer(
  characterId: number | string,
  playerId: number | string
): Promise<Character | { error }> {
  try {
    const character = await factory.getRepository().findOne(characterId, { loadRelationIds: true })
    if (!character) {
      return
    }
    if (character.player.toString() === playerId.toString()) {
      return character
    } else {
      return { error: 'unauthorized' }
    }
  } catch (err) {
    logger.error(`authorizePlayer: ${err}`)
    throw err
  }
}

export default {
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter,
  authorizePlayer
}
