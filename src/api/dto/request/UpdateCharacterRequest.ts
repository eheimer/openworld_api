// Autogenerated 4/3/2022 11:41:19 AM
//   by GenerateServerModels. DO NOT MODIFY
export class UpdateCharacterRequest {
  constructor(item: any) {
    const { name, strength, dexterity, intelligence, movement } = item
    this.name = name
    this.strength = strength
    this.dexterity = dexterity
    this.intelligence = intelligence
    this.movement = movement
  }
  name: string
  strength: number
  dexterity: number
  intelligence: number
  movement: number
}

export default UpdateCharacterRequest
