import { Entity } from 'typeorm'

import Character from '../models/Character'
import Game from '../models/Game'

/**
 * @description dto object that contains a game, and optionally a character
 */
@Entity()
export class GameCharacter {
  constructor(game: Game, char: Character, owner?: boolean) {
    this.game = game
    this.character = char
    this.owner = owner || false
  }

  game: Game

  character: Character

  owner: boolean
}

export default GameCharacter
