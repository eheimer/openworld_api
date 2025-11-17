import { CanActivate, Injectable, ExecutionContext, BadRequestException } from '@nestjs/common'
import { CharactersService } from "../../games/characters/characters.service.js"

/**
 * @description - This guard verifies that the current player is the owner of the requested character
 */
@Injectable()
export class CharacterOwnerGuard implements CanActivate {
  constructor(private charactersService: CharactersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    if (!request.params.characterId) throw new BadRequestException('Character id is required')
    const character = await this.charactersService.findOneByPlayer(request.user.id, request.params.characterId)
    return !!character
  }
}

(globalThis as any).CharacterOwnerGuard = CharacterOwnerGuard
