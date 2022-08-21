import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common'
import { GamesService } from 'src/games/games.service'

@Injectable()
export class GameOwnerGuard implements CanActivate {
  constructor(private gamesService: GamesService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.gameId) {
      return true
    }
    //find the game by id
    const game = await this.gamesService.find(request.params.gameId)
    if (!game) {
      return true
    }
    //return true if current player is the owner of the game
    return game.owner.id === request.user.id
  }
}
