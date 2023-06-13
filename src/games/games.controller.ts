import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common'
import { GamesService } from './games.service'
import { CreateGameDto } from './dto/create-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'
import { CharactersService } from './characters/characters.service'
import { Serialize } from '../interceptors/serialize.interceptor'
import { GameDto } from '../games/dto/game.dto'
import { CurrentPlayer } from '../decorators/current-player.decorator'
import { Player } from '../players/entities/player.entity'
import { GameOwnerGuard } from '../guards/authorization/game-owner.guard'
import { GameCharacterDto } from './characters/dto/game-character.dto'
import { PlayerGameCharacterGuard } from '../guards/authorization/player-game-character.guard'
import { CharacterDetailDto } from './characters/dto/character-detail.dto'
import { CreateCharacterDto } from './characters/dto/create-character.dto'
import { CharacterDto } from './characters/dto/character.dto'
import { SerializeResponse } from '../interceptors/serialize.interceptor'
import { GamePlayerGuard } from '../guards/authorization/game-player.guard'
import { Character } from './characters/entities/character.entity'
import { Game } from './entities/game.entity'

@Controller('games')
export class GamesController {
  constructor(private readonly gamesService: GamesService, private readonly charactersService: CharactersService) {}

  @Post()
  @Serialize(GameDto)
  create(@Body() createGameDto: CreateGameDto, @CurrentPlayer() player: Player) {
    return this.gamesService.create(createGameDto, player)
  }

  @Get()
  @Serialize(GameCharacterDto)
  async findAll(@CurrentPlayer() player: Player) {
    const games: { game: Game; character: Character }[] = await this.gamesService.findAllGamesWithCharacterForPlayer(
      player.id
    )
    return games.map(({ game, character }) => {
      return {
        game: { id: game.id, name: game.name },
        character: { name: character?.name },
        owner: game.owner?.id === player.id
      }
    })
  }

  @Get(':gameId')
  @Serialize(GameDto)
  async findOne(@Param('gameId') id: string) {
    return await this.gamesService.findOne(+id)
  }

  @Patch(':gameId')
  @Serialize(GameDto)
  @UseGuards(GameOwnerGuard)
  update(@Param('gameId') id: string, @Body() updateGameDto: UpdateGameDto) {
    return this.gamesService.update(+id, updateGameDto)
  }

  @Delete(':gameId')
  @UseGuards(GameOwnerGuard)
  @Serialize(GameDto)
  remove(@Param('gameId') id: string) {
    return this.gamesService.remove(+id)
  }

  //add a player to a game
  @Post(':gameId/players/:playerId')
  @UseGuards(GameOwnerGuard)
  @Serialize(GameDto)
  addPlayer(@Param('gameId') gameId: string, @Param('playerId') playerId: string) {
    return this.gamesService.addPlayer(+gameId, +playerId)
  }

  //remove a player from a game
  @Delete(':gameId/players/:playerId')
  @UseGuards(GameOwnerGuard)
  @Serialize(GameDto)
  removePlayer(@Param('gameId') gameId: string, @Param('playerId') playerId: string) {
    return this.gamesService.removePlayer(+gameId, +playerId)
  }

  //create a new character for a game
  @Post(':gameId/characters')
  @UseGuards(PlayerGameCharacterGuard)
  @Serialize(CharacterDetailDto)
  createCharacter(@Param('gameId') gameId: string, @Body() body: CreateCharacterDto, @CurrentPlayer() player: Player) {
    return this.charactersService.create(+gameId, player.id, body)
  }

  //get all characters for a game
  @Get(':gameId/characters')
  @UseGuards(GamePlayerGuard)
  @Serialize(CharacterDto, CharacterDetailDto)
  async findAllCharacters(@Param('gameId') gameId: string, @CurrentPlayer() player: Player) {
    return new SerializeResponse(await this.charactersService.findAllByGame(parseInt(gameId)), 'player.id', player.id)
  }
}
