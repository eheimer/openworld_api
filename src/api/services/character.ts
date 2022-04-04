import { Any, DeepPartial, getRepository, In } from 'typeorm'

import logger from '../../utils/logger'
import CharacterFactory from '../factories/CharacterFactory'
import InventoryFactory from '../factories/InventoryFactory'
import Character from '../models/Character'
import PlayerService from './player'
import GameService from './game'
import CharacterDetail from '../dto/CharacterDetail'
import CreatureInstanceFactory from '../factories/CreatureInstanceFactory'
import ActiveConditionFactory from '../factories/ActiveConditionFactory'

export abstract class CharacterService {
  static factory: CharacterFactory = new CharacterFactory()

  static async createCharacter(
    name: string,
    strength: number,
    dexterity: number,
    intelligence: number,
    movement: number,
    playerId: number | string,
    gameId: number | string
  ): Promise<{ characterId: number | string }> {
    try {
      const player = await PlayerService.factory.getRepository().findOne(playerId)
      const game = await GameService.factory.getRepository().findOne(gameId)
      //TODO: change this call when we finally create an InventoryService
      const inventory = await new InventoryFactory().create({
        gold: 0,
        limit: true
      })
      const character = await this.factory.create({
        name,
        strength,
        dexterity,
        intelligence,
        movement,
        hp: this.calcMaxHp(strength),
        mana: this.calcMaxMana(intelligence),
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

  static async getGameCharacter(gameId: number | string, playerId: number | string): Promise<Character> {
    try {
      return await CharacterService.factory
        .getRepository()
        .findOne({ player: playerId, game: gameId } as DeepPartial<Character>)
    } catch (err) {
      logger.error(`getCharacter: ${err}`)
      throw err
    }
  }

  static async deleteCharacter(characterId: number | string): Promise<void> {
    try {
      const character = await this.factory
        .getRepository()
        .findOne(characterId, { loadRelationIds: { relations: ['inventory', 'pets', 'conditions'] } })
      if (character) {
        await this.factory.getRepository().delete(characterId)
        await new InventoryFactory().getRepository().delete(character.inventory)
        await new CreatureInstanceFactory().getRepository().delete({ id: In(character.pets.map((i) => i.id)) })
        await new ActiveConditionFactory().getRepository().delete({ id: In(character.conditions.map((i) => i.id)) })
        // VERIFY VIA TEST: these should happen automatically with the cascade set up correctly
        //await getRepo('CharacterSkill', CharacterSkill).delete(character.skills.map((i) => i.id) as string[])
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

  static buildCharacterDetail(character: Character): CharacterDetail {
    const detail = new CharacterDetail(character)
    detail.hp = character.hp / this.calcMaxHp(character.strength)
    detail.mana = character.mana / this.calcMaxMana(character.intelligence)
    detail.inventorySize = this.calcInventorySize(character.strength)
    detail.castSpeed = this.calcCastingSpeed(character.dexterity)
    detail.healSpeed = this.calcHealSpeed(character.dexterity)
    detail.stamina = this.calcStamina(character.dexterity)
    detail.swingSpeed = this.calcSwingSpeed(character.dexterity)
    //TODO: calculate defChance, hitChance, parry, resistances based on equipment and conditions
    return detail
  }

  static calcMaxHp(strength: number): number {
    return strength * 25 + 50
  }

  static calcInventorySize(strength: number): number {
    return strength * 5 + 10
  }

  static calcMeleeDamage(strength: number): number {
    const meleeDmg = [1, 3, 4, 6]
    return meleeDmg[strength - 1]
  }

  static calcMaxMana(intelligence: number): number {
    return intelligence * 25
  }

  static calcSpellDamage(intelligence: number): number {
    const spellDmg = [0, 2, 3, 5]
    return spellDmg[intelligence - 1]
  }

  static calcFocusBonus(intelligence: number): number {
    return intelligence * 2
  }

  static calcMedBonus(intelligence: number): number {
    return this.calcFocusBonus(intelligence)
  }

  static calcStamina(dexterity: number): number {
    return dexterity * 25
  }

  static calcCastingSpeed(dexterity: number): number {
    return dexterity * -1 + 1
  }

  static calcSwingSpeed(dexterity: number): number {
    return dexterity * -1 + 1
  }

  static calcHealSpeed(dexterity: number): number {
    return this.calcSwingSpeed(dexterity)
  }
}

export default CharacterService
