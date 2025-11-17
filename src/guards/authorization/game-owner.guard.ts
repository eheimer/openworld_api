import { CanActivate, Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { GamesService } from "../../games/games.service.js"

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
    const game = await this.gamesService.findOneByOwner(request.user.id, request.params.gameId)
    return !!game
  }
}

(globalThis as any).GameOwnerGuard = GameOwnerGuard
