// Autogenerated 2/20/2022 9:48:42 AM
//   by GenerateServerModels.ts.  DO NOT MODIFY
import { Entity } from 'typeorm'

/**
 * @description - login response
 */
@Entity()
export class LoginResponse {
  constructor(item: any) {
    const { token, player } = item
    this.token = token
    this.player = player
  }
  token: string
  player: string
}

export default LoginResponse
