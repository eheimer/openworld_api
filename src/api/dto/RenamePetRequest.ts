import { Entity } from 'typeorm'

@Entity()
export class RenamePetRequest {
  constructor(args: any) {
    const { name } = args
    this.name = name
  }
  name: string
}

export default RenamePetRequest
