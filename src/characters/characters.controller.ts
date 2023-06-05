import { Controller, Get, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Player } from '../players/entities/player.entity'
import { CurrentPlayer } from '../decorators/current-player.decorator'
import { Serialize } from '../interceptors/serialize.interceptor'
import { CharacterDto } from '../characters/dto/character.dto'
import { CharacterDetailDto } from '../characters/dto/character-detail.dto'
import { CharacterOwnerGuard } from '../guards/authorization/character-owner.guard'
import { SerializeResponse } from '../interceptors/serialize.interceptor'

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService) {}

  // create is in the games controller
  // @Post()
  // create(@Body() createCharacterDto: CreateCharacterDto) {
  //   return this.charactersService.create(createCharacterDto)
  // }

  // findAll is in the games controller
  // @Get()
  // findAll() {
  //   return this.charactersService.findAll()
  // }

  @Get(':characterId')
  @Serialize(CharacterDto, CharacterDetailDto)
  async findOne(@Param('characterId') id: string, @CurrentPlayer() player: Player) {
    const c = await this.charactersService.findOne(+id)
    if (!c) {
      throw new NotFoundException('Character not found')
    }
    return new SerializeResponse(c, 'player.id', player.id)
  }

  @Patch(':characterId')
  @UseGuards(CharacterOwnerGuard)
  @Serialize(CharacterDto)
  update(@Param('characterId') id: string, @Body() updateCharacterDto: Partial<UpdateCharacterDto>) {
    return this.charactersService.update(+id, updateCharacterDto)
  }

  @Delete(':characterId')
  @UseGuards(CharacterOwnerGuard)
  remove(@Param('characterId') id: string) {
    return this.charactersService.remove(+id)
  }
}
