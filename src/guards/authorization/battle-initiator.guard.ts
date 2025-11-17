import { CanActivate, Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { BattlesService } from "../../games/battles/battles.service.js"

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
    const battle = await this.battleService.findOneByInitiator(request.user.id, request.params.battleId)
    return !!battle
  }
}

(globalThis as any).BattleInitiatorGuard = BattleInitiatorGuard
