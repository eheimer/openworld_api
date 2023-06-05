import { CanActivate, Injectable, ExecutionContext, NotFoundException, BadRequestException } from '@nestjs/common'
import { GamesService } from '../../games/games.service'

/**
 * @description - This guard verifies that the current player is in the requested game
 */
@Injectable()
export class GamePlayerGuard implements CanActivate {
  constructor(protected gamesService: GamesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.gameId) {
      throw new BadRequestException('Game id is required')
    }
    const game = await this.gamesService.findOne(request.params.gameId)
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    //throw an error if the player is not in the game
    if (!game.players.some((player) => player.id === request.user.id)) {
      throw new BadRequestException('Player is not in the game')
    }
    return true
  }
}
