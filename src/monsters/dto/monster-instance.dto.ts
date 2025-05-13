import { Expose, Transform } from 'class-transformer'
import { DamageType } from '../../damage-types/entities/damage-type.entity'
import { Logger } from '@nestjs/common'

export class MonsterInstanceDto {
  @Expose()
  name: string

  //this is a ratio of the monster's current hp to its orig hp
  @Transform(({ obj }) => obj.hp / obj.orighp)
  @Expose()
  hp: number

  @Transform(({ obj }) => {
    return obj.nextAction?.action?.name
  })
  @Expose()
  actionName: string

  @Transform(({ obj }) => {
    let tmp = obj.nextAction?.value
    if (tmp === 0) {
      tmp = obj.nextAction?.action.value
    }
    if (obj.nextAction?.action.name.toLowerCase() === 'breath weapon') {
      tmp = Math.round(obj.hp / 5)
    }
    return tmp
  })
  @Expose()
  actionValue: string

  @Transform(({ obj }) => {
    let tmp = obj.nextAction?.description
    if (tmp === '') {
      tmp = obj.nextAction?.action.description
    }
    if (obj.nextAction?.action.name.toLowerCase() === 'breath weapon') {
      tmp = ''
    }
    return tmp
  })
  @Expose()
  actionDescription: string

  // meleeDmg = baseDmg + (baseDmg * finalDamageBonus)
  // finalDamageBonus = (anatomyBonus + strengthBonus + tacticsBonus) / 100
  // anatomyBonus = (anatomy / 2) + (additional 5 if anatomy >= 100)
  // strengthBonus = (strength * 0.3) + (additional 5 if strength >= 100)
  // tacticsBonus = (tactics / 1.6) + (additional 6 if tactics >= 100)
  // use the @Transform decorator to calculate this value
  @Transform(({ obj }) => {
    const anatomyBonus = obj.anatomy / 2 + (obj.anatomy >= 100 ? 5 : 0)
    const strengthBonus = obj.strength * 0.3 + (obj.strength >= 100 ? 5 : 0)
    const tacticsBonus = obj.tactics / 1.6 + (obj.tactics >= 100 ? 6 : 0)
    const finalDamageBonus = (anatomyBonus + strengthBonus + tacticsBonus) / 100
    return Math.round(obj.baseDmg + obj.baseDmg * finalDamageBonus)
  })
  @Expose()
  meleeDmg: number

  @Transform(({ obj }) => {
    let tmp
    if (obj.nextAction?.action.name.toLowerCase().startsWith('melee')) {
      tmp = obj.monster.damageType
    }
    if (obj.nextAction?.action.name.toLowerCase() === 'breath weapon') {
      tmp = obj.monster.breathDmgType
    }
    return tmp?.name
  })
  @Expose()
  actionDamageType: DamageType

  @Transform(({ obj }) => obj.nextAction?.action?.initiative)
  @Expose()
  initiative: number

  @Transform(({ obj }) => obj.monster?.id)
  @Expose()
  monsterId: number
}
