// Autogenerated 2/16/2022 9:08:18 PM
import { Entity } from 'typeorm'

@Entity()
export class MonsterRequest {
  constructor(item: any) {
    const { monsterId } = item

    this.monsterId = monsterId
  }

  monsterId: number
}

export default MonsterRequest
