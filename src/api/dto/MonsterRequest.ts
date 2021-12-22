import { Entity } from 'typeorm'

@Entity()
export class MonsterRequest {
  constructor(args: any) {
    const { monsterId } = args
    this.monsterId = monsterId
  }
  monsterId: number
}
