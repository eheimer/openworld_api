// Autogenerated 2/20/2022 11:58:42 AM
//   by GenerateServerModels. DO NOT MODIFY
import { Entity } from 'typeorm'

/**
 * @description - an error
 */
@Entity()
export class Error {
  constructor(item: any) {
    const { type, message } = item
    this.type = type
    this.message = message
  }
  type: string
  message: string
}

export default Error