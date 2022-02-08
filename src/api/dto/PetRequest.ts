import { Entity } from 'typeorm'

@Entity()
export default class PetRequest {
  constructor(args: any) {
    const { name } = args
    this.name = name
  }
  name: string
}
