import { CanActivate, Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { GamesService } from "../../games/games.service.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

/**
 * @description - This guard verifies that the requested battle is in the requested game
 */
@Injectable()
export class GameBattleGuard implements CanActivate {
  constructor(protected gamesService: GamesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.gameId) {
      throw new BadRequestException('Game id is required')
    }
    if (!request.params.battleId) {
      throw new BadRequestException('Battle id is required')
    }
    const game = await this.gamesService.findOneHavingBattle(request.params.gameId, request.params.battleId)
    return !!game
  }
}

registerEntity('GameBattleGuard', GameBattleGuard)
