import { Entity } from 'typeorm'
import Character from '../models/Character'
import Game from '../models/Game'

@Entity()
export class GamesResponse {
  constructor(item: any) {
    const { game, character, owner } = item
    this.game = game
    this.character = character
    this.owner = owner
  }

  game: Game
  character: Character
  owner: boolean
}

export default GamesResponse
