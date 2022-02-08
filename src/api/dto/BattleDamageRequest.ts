import { Entity } from 'typeorm'

@Entity()
export class BattleDamageRequest {
  constructor(args: any) {
    const { creatures, characters, damageType, damageAmt } = args
    this.creatures = creatures
    this.characters = characters
    this.damageType = damageType
    this.damageAmt = damageAmt
  }

  creatures: number[]
  characters: number[]
  damageType: number
  damageAmt: number
}

export default BattleDamageRequest
