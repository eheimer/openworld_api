import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common'
import { PlayersService } from "../../players/players.service"
import { getEntity, registerEntity } from "../../entityRegistry"

/**
 * @description - This guard verifies that the current player is the requested player
 */
@Injectable()
export class CurrentPlayerGuard implements CanActivate {
  constructor(private playersService: PlayersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    return +request.params.playerId === request.user.id
  }
}

registerEntity('CurrentPlayerGuard', CurrentPlayerGuard)
