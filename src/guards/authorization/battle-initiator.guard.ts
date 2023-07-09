import { CanActivate, Injectable, ExecutionContext, NotFoundException, BadRequestException } from '@nestjs/common'
import { BattlesService } from '../../games/battles/battles.service'

/**
 * @description - This guard verifies that the current player is the initiator of the requested battle
 */
@Injectable()
export class BattleInitiatorGuard implements CanActivate {
  constructor(private battleService: BattlesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.battleId) {
      throw new BadRequestException('Battle id is required')
    }
    const battle = await this.battleService.findOne(request.params.battleId)
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    //return true if current player is the initiator of the battle
    return battle.initiator?.player?.id === request.user.id
  }
}
