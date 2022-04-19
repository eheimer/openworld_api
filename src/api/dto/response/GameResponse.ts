// Autogenerated 2/25/2022 9:02:05 PM
//   by GenerateServerModels. DO NOT MODIFY
import Game from '../Game'

/**
 * @description - game response
 */
export class GameResponse extends Game {
  constructor(item: any) {
    super(item)
    const { players, characters, battles } = item
    this.players = players
    this.characters = characters
    this.battles = battles
  }
  players: string[]
  characters: string[]
  battles: string[]
}

export default GameResponse
