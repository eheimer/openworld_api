import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, UseGuards } from '@nestjs/common'
import { CurrentPlayer } from "../../decorators/current-player.decorator.js"
import { CharacterOwnerGuard } from "../../guards/authorization/character-owner.guard.js"
import { Serialize, SerializeResponse } from "../../interceptors/serialize.interceptor.js"
import { Player } from "../../players/entities/player.entity.js"
import { GamesService } from "../games.service.js"
import { CharactersService } from "./characters.service.js"
import { CharacterDetailDto } from "./dto/character-detail.dto.js"
import { CharacterDto } from "./dto/character.dto.js"
import { UpdateCharacterDto } from "./dto/update-character.dto.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

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

registerEntity('CharactersController', CharactersController)
