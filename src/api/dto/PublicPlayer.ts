import { Entity } from 'typeorm'

@Entity()
export class PublicPlayer {
  constructor(args: any) {
    const { name, lastSeenAt } = args
    this.name = name
    this.lastSeenAt = lastSeenAt
  }
  name: string
  lastSeenAt: Date
}

export default PublicPlayer
