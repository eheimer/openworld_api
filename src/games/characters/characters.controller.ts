import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common'
import { CurrentPlayer } from "../../decorators/current-player.decorator"
import { CharacterOwnerGuard } from "../../guards/authorization/character-owner.guard"
import { Serialize, SerializeResponse } from "../../interceptors/serialize.interceptor"
import { Player } from "../../players/entities/player.entity"
import { GamesService } from "../games.service"
import { CharactersService } from "./characters.service"
import { CharacterDetailDto } from "./dto/character-detail.dto"
import { CharacterDto } from "./dto/character.dto"
import { UpdateCharacterDto } from "./dto/update-character.dto"

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
    const character = await this.charactersService.findOneWithBattle(+id)
    return new SerializeResponse(character, 'player.id', player.id)
  }

  @Patch(':characterId')
  @UseGuards(CharacterOwnerGuard)
  @Serialize(CharacterDetailDto)
  update(@Param('characterId') id: string, @Body() updateCharacterDto: Partial<UpdateCharacterDto>) {
    return this.charactersService.update(+id, updateCharacterDto)
  }

  @Delete(':characterId')
  @UseGuards(CharacterOwnerGuard)
  remove(@Param('characterId') id: string) {
    return this.charactersService.remove(+id)
  }
}

