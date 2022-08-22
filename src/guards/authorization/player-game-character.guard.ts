import { CanActivate, Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { GamesService } from 'src/games/games.service'
import { CharactersService } from '../../characters/characters.service'

/**
 * @description - This guard verifies that the current player is in the requested game
 *              and does not already have a character in the game
 */
@Injectable()
export class PlayerGameCharacterGuard implements CanActivate {
  constructor(private gamesService: GamesService, private charactersService: CharactersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const playerId = request.user.id
    const gameId = request.params.gameId
    if (!gameId) {
      throw new BadRequestException('Game id is required')
    }
    const game = await this.gamesService.findWithPlayer(gameId, playerId)
    if (game) {
      //check if player has a character in the game
      const character = await this.charactersService.findByPlayerAndGame(playerId, gameId)
      if (character) {
        throw new BadRequestException('Player already has a character in this game')
      }
    }
    return game !== null
  }
}
