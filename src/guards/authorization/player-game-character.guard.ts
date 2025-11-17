import { Injectable, ExecutionContext, BadRequestException, Logger } from '@nestjs/common'
import { GamesService } from "../../games/games.service.js"
import { CharactersService } from "../../games/characters/characters.service.js"
import { GamePlayerGuard } from "./game-player.guard.js"

/**
 * @description - This guard verifies that the current player is in the requested game
 *              and does not already have a character in the game
 */
@Injectable()
export class PlayerGameCharacterGuard extends GamePlayerGuard {
  constructor(protected gamesService: GamesService, private charactersService: CharactersService) {
    super(gamesService)
  }

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.gameId) {
      throw new BadRequestException('Game id is required')
    }
    const game = await this.gamesService.findOneWithHavingPlayerCharacter(request.params.gameId, request.user.id)
    return (await super.canActivate(context)) && !game
  }
}

(globalThis as any).PlayerGameCharacterGuard = PlayerGameCharacterGuard
