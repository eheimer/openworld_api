import { Entity } from 'typeorm'

@Entity()
export class LoginResponse {
  constructor(args: any) {
    const { token, player } = args
    this.token = token
    this.player = player
  }
  player: string
  token: string
}
