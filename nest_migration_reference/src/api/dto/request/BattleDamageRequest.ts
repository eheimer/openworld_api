// Autogenerated 2/20/2022 12:12:09 PM
//   by GenerateServerModels. DO NOT MODIFY
export class BattleDamageRequest {
  constructor(item: any) {
    const { creatures, characters, damageType, damageAmt } = item
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