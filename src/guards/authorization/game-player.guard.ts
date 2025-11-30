import { CanActivate, Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { GamesService } from "../../games/games.service"
import { getEntity, registerEntity } from "../../entityRegistry"

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
    const game = await this.gamesService.findOneHavingPlayer(request.params.gameId, request.user.id)
    return !!game
  }
}

registerEntity('GamePlayerGuard', GamePlayerGuard)
