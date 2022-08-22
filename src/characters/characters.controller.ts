import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { CharacterOwnerGuard } from '../guards/authorization/character-owner.guard'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { CharacterDto } from './dto/character.dto'
import { CharacterDetailDto } from './dto/character-detail.dto'
import { CurrentPlayer } from 'src/decorators/current-player.decorator'
import { Player } from '../players/player.entity'
import { SerializeResponse } from '../interceptors/serialize.interceptor'
import { CreateCharacterDto } from './dto/create-character.dto'

@Controller('characters')
export class CharactersController {
  constructor(private charactersService: CharactersService) {}

  @Delete('/:characterId')
  @UseGuards(CharacterOwnerGuard)
  deleteCharacter(@Param('characterId') id) {
    return this.charactersService.delete(id)
  }

  // get a character
  @Get('/:characterId')
  @Serialize(CharacterDto, CharacterDetailDto)
  async findOne(@Param('characterId') id: string, @CurrentPlayer() player: Player) {
    return new SerializeResponse(await this.charactersService.find(parseInt(id)), 'player.id', player.id)
  }

  // update a character
  @Patch('/:characterId')
  @UseGuards(CharacterOwnerGuard)
  async update(@Param('characterId') id: string, @Body() character: Partial<CreateCharacterDto>) {
    return this.charactersService.update(parseInt(id), {
      name: character.name,
      strength: character.strength,
      dexterity: character.dexterity,
      intelligence: character.intelligence
    })
  }
}
