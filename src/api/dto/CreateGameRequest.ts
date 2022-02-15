import { Entity } from 'typeorm'

@Entity()
export class CreateGameRequest {
  constructor(args: any) {
    const { name, maxPlayers } = args
    this.name = name
    this.maxPlayers = maxPlayers
  }
  name: string
  maxPlayers: number
}

export default CreateGameRequest
