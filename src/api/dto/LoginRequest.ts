import { Entity } from 'typeorm'

@Entity()
export class LoginRequest {
  constructor(item: any) {
    const { email, password } = item
    this.email = email
    this.password = password
  }

  email: string
  password: string
}

export default LoginRequest
