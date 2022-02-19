// Autogenerated 2/19/2022 4:49:06 PM
import { Entity } from 'typeorm'

@Entity()
export class UpdateCharacterRequest {
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

export default UpdateCharacterRequest
