import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { CharacterOwnerGuard } from '../guards/authorization/character-owner.guard'

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Delete('/:characterId')
  @UseGuards(CharacterOwnerGuard)
  deleteCharacter(@Param('characterId') id) {
    return this.charactersService.delete(id)
  }
}
