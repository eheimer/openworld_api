import { Entity } from 'typeorm'

@Entity()
export default class MonsterRequest {
  constructor(args: any) {
    const { monsterId } = args
    this.monsterId = monsterId
  }
  monsterId: number
}
