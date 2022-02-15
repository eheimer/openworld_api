import { Entity } from 'typeorm'

@Entity()
export class PlayerResponse {
  constructor(item: any) {
    const { id, email, name, lastSeenAt } = item
    this.id = id
    this.email = email
    this.name = name
    this.lastSeenAt = lastSeenAt
  }

  id: string
  email: string
  name: string
  lastSeenAt: Date
}

export default PlayerResponse
