// Autogenerated 2/20/2022 12:12:09 PM
//   by GenerateServerModels. DO NOT MODIFY
import { Entity } from 'typeorm'

@Entity()
export class UpdateGameRequest {
  constructor(item: any) {
    const { name, maxPlayers } = item
    this.name = name
    this.maxPlayers = maxPlayers
  }
  name: string
  maxPlayers: number
}

export default UpdateGameRequest
