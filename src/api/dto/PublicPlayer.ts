// Autogenerated 2/20/2022 9:48:42 AM
//   by GenerateServerModels.ts.  DO NOT MODIFY
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
