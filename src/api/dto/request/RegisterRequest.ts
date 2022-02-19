// Autogenerated 2/19/2022 4:02:06 PM
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
