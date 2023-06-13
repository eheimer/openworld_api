import { Controller, Get, Body, Patch, Param, Delete, UseGuards, NotFoundException } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Player } from '../../players/entities/player.entity'
import { CurrentPlayer } from '../../decorators/current-player.decorator'
import { Serialize } from '../../interceptors/serialize.interceptor'
import { CharacterDto } from './dto/character.dto'
import { CharacterDetailDto } from './dto/character-detail.dto'
import { CharacterOwnerGuard } from '../../guards/authorization/character-owner.guard'
import { SerializeResponse } from '../../interceptors/serialize.interceptor'
import { GamesService } from '../games.service'

@Controller('characters')
export class CharactersController {
  constructor(private readonly charactersService: CharactersService, private readonly gamesService: GamesService) {}

  @Get(':characterId')
  @Serialize(CharacterDto, CharacterDetailDto)
  async findOne(@Param('characterId') id: string, @CurrentPlayer() player: Player) {
    // current player is only authorized to see this character if they are in the
    // same game that the character is in.
    const games = await this.gamesService.findAllGamesForPlayerWithCharacters(player.id)
    const game = games.find((g) => g.characters.find((c) => c.id === +id))
    if (!game) {
      throw new NotFoundException('Character not found')
    }
    return new SerializeResponse(
      game.characters.find((c) => c.id === +id),
      'player.id',
      player.id
    )
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
