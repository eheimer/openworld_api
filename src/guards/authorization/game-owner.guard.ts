import { CanActivate, Injectable, ExecutionContext, NotFoundException, BadRequestException } from '@nestjs/common'
import { GamesService } from 'src/games/games.service'

/**
 * @description - This guard verifies that the current player is the owner of the requested game
 */
@Injectable()
export class GameOwnerGuard implements CanActivate {
  constructor(private gamesService: GamesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.gameId) {
      throw new BadRequestException('Game id is required')
    }
    const game = await this.gamesService.find(request.params.gameId)
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    //return true if current player is the owner of the game
    return game.owner.id === request.user.id
  }
}
