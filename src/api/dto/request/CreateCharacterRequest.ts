// Autogenerated 2/16/2022 9:08:18 PM
import { Entity } from 'typeorm'

@Entity()
export class CreateCharacterRequest {
  constructor(item: any) {
    const { name, maxHp, baseResist, inventorySize } = item

    this.name = name
    this.maxHp = maxHp
    this.baseResist = baseResist
    this.inventorySize = inventorySize
  }

  name: string
  maxHp: number
  baseResist: number
  inventorySize: number
}

export default CreateCharacterRequest