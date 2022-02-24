import { DeepPartial } from 'typeorm'

import logger from '../../utils/logger'
import CharacterFactory from '../factories/CharacterFactory'
import InventoryFactory from '../factories/InventoryFactory'
import Character from '../models/Character'
import PlayerService from './player'
import GameService from './game'

export abstract class CharacterService {
  static factory: CharacterFactory = new CharacterFactory()

  static async createCharacter(
    name: string,
    maxHp: number,
    baseResist: number,
    inventorySize: number,
    playerId: number | string,
    gameId: number | string
  ): Promise<{ characterId: number | string }> {
    try {
      const player = await PlayerService.factory.getRepository().findOne(playerId)
      const game = await GameService.factory.getRepository().findOne(gameId)
      //TODO: change this call when we finally create an InventoryService
      const inventory = await new InventoryFactory().create({
        gold: 0,
        capacity: inventorySize,
        limit: false
      })
      const character = await this.factory.create({
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

  static async updateCharacter(characterId: number | string, part: DeepPartial<Character>): Promise<void> {
    try {
      if (part.baseResist) {
        part.resistC = part.baseResist
        part.resistE = part.baseResist
        part.resistF = part.baseResist
        part.resistP = part.baseResist
        part.resistPh = part.baseResist
      }
      await this.factory.getRepository().update(characterId, part)
    } catch (err) {
      logger.error(`updateCharacter: ${err}`)
      throw err
    }
  }

  static async getCharacter(characterId: number | string): Promise<Character> {
    try {
      return await this.factory.getRepository().findOne(characterId, {
        relations: ['inventory'],
        loadRelationIds: { relations: ['player'] }
      })
    } catch (err) {
      logger.error(`getCharacter: ${err}`)
      throw err
    }
  }

  static async deleteCharacter(characterId: number | string): Promise<void> {
    try {
      const character = await this.factory
        .getRepository()
        .findOne(characterId, { loadRelationIds: { relations: ['inventory'] } })
      if (character) {
        await this.factory.getRepository().delete(characterId)
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
  static async authorizePlayer(
    characterId: number | string,
    playerId: number | string
  ): Promise<Character | { error }> {
    try {
      const character = await this.factory.getRepository().findOne(characterId, { loadRelationIds: true })
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
}

export default CharacterService
