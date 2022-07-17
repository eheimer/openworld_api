import { DeepPartial, In } from 'typeorm'

import logger from '../../utils/logger'
import CharacterFactory from '../factories/CharacterFactory'
import InventoryFactory from '../factories/InventoryFactory'
import Character from '../models/Character'
import PlayerService from './player'
import GameService from './game'
import CharacterDetail from '../dto/CharacterDetail'
import CreatureInstanceFactory from '../factories/CreatureInstanceFactory'
import ActiveConditionFactory from '../factories/ActiveConditionFactory'
import CharacterSkill from '../models/CharacterSkill'
import CharacterSkillDTO from '../dto/CharacterSkill'
import { getRepo } from '../../utils/db'
import Skill from '../models/Skill'

export abstract class CharacterService {
  static factory: CharacterFactory = new CharacterFactory()

  static async createCharacter(
    name: string,
    strength: number,
    dexterity: number,
    intelligence: number,
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
        sleep: 1,
        hunger: 1,
        hp: this.calcMaxHp(strength, 1),
        mana: this.calcMaxMana(intelligence, 1),
        stamina: this.calcMaxStamina(dexterity),
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

  static async addCharacterSkill(characterId: number | string, skillId: number | string, level: number): Promise<void> {
    try {
      const character = await this.factory
        .getRepository()
        .findOne(characterId, { relations: ['skills', 'skills.skill'] })
      if (character) {
        if (!character.skills) character.skills = []
        const skill = await getRepo('Skill', Skill).findOne(skillId)
        if (!character.skills.map((i) => i.skill).includes(skill)) {
          const cSkill = new CharacterSkill()
          cSkill.character = character
          cSkill.skill = skill
          cSkill.level = level
          await getRepo('CharacterSkill', CharacterSkill).save(cSkill)
        }
      }
    } catch (err) {
      logger.error(`addCharacterSkill: ${err}`)
      throw err
    }
  }

  static buildCharacterDetail(character: Character): CharacterDetail {
    //get the race definition for the character
    const detail = new CharacterDetail(character)
    detail.hunger = 1
    detail.sleep = 1
    detail.inventorySize = this.calcInventorySize(character.strength)
    detail.castSpeed = this.calcCastingSpeed(character.dexterity)
    detail.healSpeed = this.calcHealSpeed(character.dexterity)
    detail.maxStamina = this.calcMaxStamina(character.dexterity)
    detail.stamina = Math.min(character.stamina / detail.maxStamina, 1)
    detail.swingSpeed = this.calcSwingSpeed(character.dexterity)
    //TODO: calculate defChance, hitChance, parry, resistances based on equipment and conditions
    if (character.race) {
      //TODO: replenish values will also be affected by equipment and conditions
      detail.hpReplenish = character.race.hpReplenish
      detail.manaReplenish = character.race.manaReplenish
      detail.staminaReplenish = character.race.staminaReplenish
      detail.movement = character.race.movement
      if (character.race.hunger) {
        detail.hunger = Math.min(character.hunger / character.race.hunger, 1)
      }
      if (character.race.sleep) {
        detail.sleep = Math.min(character.sleep / character.race.sleep, 1)
      }
      detail.raceName = character.race.name
      detail.raceDescription = character.race.description
      detail.raceSkills = character.race.skills.map((raceSkill) => {
        return new CharacterSkillDTO({
          id: raceSkill.skill.id,
          name: raceSkill.skill.name,
          description: raceSkill.skill.description,
          level: raceSkill.level
        })
      })
    }
    detail.maxHp = this.calcMaxHp(character.strength, character.hunger)
    detail.hp = Math.min(character.hp / detail.maxHp, 1)
    detail.maxMana = this.calcMaxMana(character.intelligence, character.sleep)
    detail.mana = Math.min(character.mana / detail.maxMana, 1)
    return detail
  }

  static calcMaxHp(strength: number, hunger: number): number {
    const maxHp = (strength * 25 + 50) * Math.max(hunger, 0.25)
    return maxHp
  }

  static calcInventorySize(strength: number): number {
    return strength * 5 + 10
  }

  static calcMeleeDamage(strength: number): number {
    const meleeDmg = [1, 3, 4, 6]
    return meleeDmg[strength - 1]
  }

  static calcMaxMana(intelligence: number, sleep: number): number {
    const maxMana = intelligence * 25 * Math.max(sleep, 0.25)
    return maxMana
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

  static calcMaxStamina(dexterity: number): number {
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
