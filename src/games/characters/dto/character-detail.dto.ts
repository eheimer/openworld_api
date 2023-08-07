import { Expose, Transform } from 'class-transformer'
import { CharacterDto } from './character.dto'
import { InventoryDto } from '../../../items/dto/inventory.dto'
import { DTO } from '../../../decorators/dto-property.decorator'
import { CharacterSkillDto } from './character-skill.dto'

export class CharacterDetailDto extends CharacterDto {
  //NOTE: for the calculations below, reference the CharactersService calc methods
  // I haven't figured out how to access that service from the Transform decorator,
  // so all that logic is duplicated for now

  @Expose() strength: number
  @Expose() dexterity: number
  @Expose() intelligence: number

  @Expose()
  @DTO(InventoryDto)
  inventory: InventoryDto

  @Expose()
  @Transform(({ obj }) => {
    if (obj.race?.hunger) {
      return Math.min((obj.hunger / obj.race.hunger) * 100, 100)
    } else {
      return obj.hunger
    }
  })
  hunger: number

  @Expose()
  @Transform(({ obj }) => {
    if (obj.race?.sleep) {
      return Math.min((obj.sleep / obj.race.sleep) * 100, 100)
    } else {
      return obj.sleep
    }
  })
  sleep: number

  @Expose()
  @Transform(({ obj }) => obj.strength * 5 + 10)
  inventorySize: number

  @Expose()
  @Transform(({ obj }) => obj.dexterity * -1 + 1)
  castSpeed: number

  @Expose()
  @Transform(({ obj }) => obj.dexterity * -1 + 1)
  healSpeed: number

  @Expose()
  @Transform(({ obj }) => obj.dexterity * -1 + 1)
  swingSpeed: number

  //TODO: calculate defChance, hitChance, parry, resistances based on equipment and conditions
  @Expose() defChance: number
  @Expose() hitChance: number
  @Expose() parry: number
  @Expose() resistances: number

  //TODO: replenish values will also be affected by equipment and conditions
  @Expose()
  @Transform(({ obj }) => obj.race?.hpReplenish)
  hpReplenish: number

  @Expose()
  @Transform(({ obj }) => obj.race?.manaReplenish)
  manaReplenish: number

  @Expose()
  @Transform(({ obj }) => obj.race?.staminaReplenish)
  staminaReplenish: number

  @Expose()
  @Transform(({ obj }) => obj.race?.movement)
  movement: number

  @Expose()
  @Transform(({ obj }) => obj.race?.description)
  raceDescription: string

  @Expose()
  @Transform(({ obj }) => {
    return (
      obj.race?.skills?.map((raceSkill) => {
        return {
          id: raceSkill.skill.id,
          name: raceSkill.skill.name,
          description: raceSkill.skill.description,
          level: raceSkill.level
        }
      }) || []
    )
  })
  raceSkills: CharacterSkillDto[]

  @Expose()
  @Transform(({ obj }) => {
    const maxHp = (obj.strength * 25 + 50) * Math.max(obj.hunger, 0.25)
    return Math.min((obj.hp / maxHp) * 100, 100)
  })
  hp: number

  @Expose()
  @Transform(({ obj }) => {
    const maxMana = obj.intelligence * 25 * Math.max(obj.sleep, 0.25)
    return Math.min((obj.mana / maxMana) * 100, 100)
  })
  mana: number

  @Expose()
  @Transform(({ obj }) => {
    const maxStamina = obj.dexterity * 25
    return Math.min((obj.stamina / maxStamina) * 100, 100)
  })
  stamina: number

  @Expose()
  @Transform(({ obj }) => (obj.strength * 25 + 50) * Math.max(obj.hunger, 0.25))
  maxHp: number

  @Expose()
  @Transform(({ obj }) => obj.intelligence * 25 * Math.max(obj.sleep, 0.25))
  maxMana: number

  @Expose()
  @Transform(({ obj }) => obj.dexterity * 25)
  maxStamina: number

  @Expose()
  new: boolean
}
