// Autogenerated 2/20/2022 9:48:42 AM
//   by GenerateServerModels.ts.  DO NOT MODIFY
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
