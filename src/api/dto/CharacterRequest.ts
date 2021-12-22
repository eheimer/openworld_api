import { Entity } from 'typeorm'

@Entity()
export class CharacterRequest {
  constructor(args: any) {
    const { name, maxHp, inventorySize } = args
    this.name = name
    this.maxHp = maxHp
    this.inventorySize = inventorySize
  }
  name: string
  maxHp: number
  baseResist: number
  inventorySize: number
}
