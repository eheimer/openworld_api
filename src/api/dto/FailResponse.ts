import { Entity } from 'typeorm'

@Entity()
export default class FailResponse {
  constructor(error: string, success = false) {
    this.success = success
    this.error = error
  }

  success: boolean

  error: string
}
