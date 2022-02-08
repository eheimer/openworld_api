import { Entity } from 'typeorm'

@Entity()
export default class GameRequest {
  constructor(args: any) {
    const { name, maxPlayers } = args
    this.name = name
    this.maxPlayers = maxPlayers
  }
  name: string
  maxPlayers: number
}
