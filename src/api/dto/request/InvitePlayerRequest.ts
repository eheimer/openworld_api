// Autogenerated 2/20/2022 9:48:42 AM
//   by GenerateServerModels.ts.  DO NOT MODIFY
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
