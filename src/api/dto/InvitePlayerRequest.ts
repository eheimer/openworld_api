import { Entity } from 'typeorm'

@Entity()
export class InvitePlayerRequest {
  constructor(item: any) {
    const { email } = item
    this.email = email
  }

  email: string
}

export default InvitePlayerRequest
