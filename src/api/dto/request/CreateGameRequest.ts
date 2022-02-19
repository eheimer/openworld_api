// Autogenerated 2/19/2022 4:02:06 PM
import { Entity } from 'typeorm'

@Entity()
export class CreateGameRequest {
  constructor(item: any) {
    const { name, maxPlayers } = item
    this.name = name
    this.maxPlayers = maxPlayers
  }
  name: string
  maxPlayers: number
}

export default CreateGameRequest
