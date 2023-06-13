import { Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { GamesService } from '../../games/games.service'
import { CharactersService } from '../../games/characters/characters.service'
import { GamePlayerGuard } from './game-player.guard'

/**
 * @description - This guard verifies that the current player is in the requested game
 *              and does not already have a character in the game
 */
@Injectable()
export class PlayerGameCharacterGuard extends GamePlayerGuard {
  constructor(protected gamesService: GamesService, private charactersService: CharactersService) {
    super(gamesService)
  }
  async canActivate(context: ExecutionContext) {
    //return false if the current player is not in the game
    if (!(await super.canActivate(context))) {
      return false
    }
    const request = context.switchToHttp().getRequest()
    const playerId = request.user.id
    const gameId = request.params.gameId
    if (!gameId) {
      throw new BadRequestException('Game id is required')
    }
    //check if player has a character in the game
    const character = await this.charactersService.findByPlayerAndGame(playerId, gameId)
    if (character) {
      throw new BadRequestException('Player already has a character in this game')
    }
    return true
  }
}
