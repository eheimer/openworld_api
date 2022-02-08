import { Entity } from 'typeorm'

@Entity()
export class PetRequest {
  constructor(args: any) {
    const { name } = args
    this.name = name
  }
  name: string
}

export default PetRequest
