import { Entity } from 'typeorm'

@Entity()
export class FailResponse {
  constructor(error: string, success = false) {
    this.success = success
    this.error = error
  }

  success: boolean

  error: string
}
