// Autogenerated 2/20/2022 12:12:09 PM
//   by GenerateServerModels. DO NOT MODIFY
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
