// Autogenerated 2/16/2022 9:08:18 PM
import { Entity } from 'typeorm'

@Entity()
export class RegisterRequest {
  constructor(item: any) {
    const { email, password, name } = item

    this.email = email
    this.password = password
    this.name = name
  }

  email: string
  password: string
  name: string
}

export default RegisterRequest
