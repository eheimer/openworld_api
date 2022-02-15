import { Entity } from 'typeorm'

@Entity()
export class CreateCharacterRequest {
  constructor(args: any) {
    const { name, maxHp, baseResist, inventorySize } = args
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
