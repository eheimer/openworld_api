import { CanActivate, Injectable, ExecutionContext, NotFoundException, BadRequestException } from '@nestjs/common'
import { CharactersService } from '../../characters/characters.service'

/**
 * @description - This guard verifies that the current player is the owner of the requested character
 */
@Injectable()
export class CharacterOwnerGuard implements CanActivate {
  constructor(private charactersService: CharactersService) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()
    const character = await this.charactersService.findOne(request.params.characterId)
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    //return true if current player is the owner of the character
    return character.player.id === request.user.id
  }
}
