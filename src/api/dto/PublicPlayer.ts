// Autogenerated 2/20/2022 11:58:42 AM
//   by GenerateServerModels. DO NOT MODIFY
import { Entity } from 'typeorm'

/**
 * @description - Player object
 */
@Entity()
export class PublicPlayer {
  constructor(item: any) {
    const { name, lastSeenAt } = item
    this.name = name
    this.lastSeenAt = lastSeenAt
  }
  name: string
  lastSeenAt: Date
}

export default PublicPlayer
