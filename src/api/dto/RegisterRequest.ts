import { Entity } from 'typeorm'

@Entity()
export class RegisterRequest {
  constructor(args: any) {
    const { email, password, name } = args
    this.email = email
    this.password = password
    this.name = name
  }
  email: string
  password: string
  name: string
}

export default RegisterRequest
