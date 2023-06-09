import { CanActivate, Injectable, ExecutionContext, NotFoundException, BadRequestException } from '@nestjs/common'
import { GamesService } from '../../games/games.service'

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
    const game = await this.gamesService.findOne(request.params.gameId)
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    //throw an error if the battle is not in the game
    if (!game.battles.some((battle) => battle.id.toString() === request.params.battleId)) {
      // convert game.battles to an array of ids
      const battleIds = game.battles.map((battle) => battle.id)
      throw new BadRequestException(`Battle ${request.params.battleId} is not in the game: [${battleIds}]`)
    }
    return true
  }
}
