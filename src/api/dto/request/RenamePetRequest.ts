// Autogenerated 2/19/2022 4:02:06 PM
import { Entity } from 'typeorm'

@Entity()
export class RenamePetRequest {
  constructor(item: any) {
    const { name } = item
    this.name = name
  }
  name: string
}

export default RenamePetRequest
