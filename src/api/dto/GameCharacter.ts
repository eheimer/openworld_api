import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity } from "typeorm"
import Game from "../models/Game"
import Character from "../models/Character"

/**
 * @description dto object that contains a game, and optionally a character
 */
@Entity()
export class GameCharacter {
    constructor(game: Game, char: Character) {
        this.game = game
        this.character = char
    }
        
    game: Game

    character: Character
}