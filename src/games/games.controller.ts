import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { CurrentPlayer } from 'src/decorators/current-player.decorator'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { Player } from 'src/players/player.entity'
import { CreateGameDto } from './dto/create-game.dto'
import { GamesService } from './games.service'
import { GameDto } from './dto/game.dto'
import { GameOwnerGuard } from 'src/guards/authorization/game-owner.guard'
import { PlayersService } from '../players/players.service'
import { CharactersService } from '../characters/characters.service'
import { CreateCharacterDto } from '../characters/dto/create-character.dto'
import { PlayerGameCharacterGuard } from '../guards/authorization/player-game-character.guard'
import { CharacterDetailDto } from '../characters/dto/character-detail.dto'
import { GameCharacterDto } from '../players/dto/game-character.dto'
import { CharacterDto } from '../characters/dto/character.dto'

@Controller('games')
export class GamesController {
  constructor(
    private gamesService: GamesService,
    private playersService: PlayersService,
    private charactersService: CharactersService
  ) {}

  @Post('/')
  @Serialize(GameDto)
  create(@Body() body: CreateGameDto, @CurrentPlayer() player: Player) {
    return this.gamesService.create(body.name, player)
  }

  @Patch('/:gameId')
  @Serialize(GameDto)
  @UseGuards(GameOwnerGuard)
  update(@Body() body: Partial<CreateGameDto>, @CurrentPlayer() player: Player, @Param('gameId') id: string) {
    return this.gamesService.update(parseInt(id), body)
  }

  @Get('/')
  /**
   * retrieve the games that the player is part of, with the associated characters
   */
  @Serialize(GameCharacterDto)
  async findAll(@CurrentPlayer() player: Player) {
    return await this.playersService.findAllGamesWithCharacter(player)
  }

  @Get('/:id')
  @Serialize(GameDto)
  /**
   * retrieve a specific game
   */
  async findOne(@Param('id') id: string) {
    return await this.gamesService.find(parseInt(id))
  }

  //delete a game
  @Delete('/:gameId')
  @UseGuards(GameOwnerGuard)
  @Serialize(GameDto)
  async delete(@Param('gameId') id: string) {
    return await this.gamesService.delete(parseInt(id))
  }

  //add a player to a game
  @Post('/:gameId/players/:playerId')
  @UseGuards(GameOwnerGuard)
  async addPlayer(@Param('gameId') gameId: string, @Param('playerId') playerId: string) {
    return await this.gamesService.addPlayer(parseInt(gameId), parseInt(playerId))
  }

  //remove a player from a game
  @Delete('/:gameId/players/:playerId')
  @UseGuards(GameOwnerGuard)
  async removePlayer(@Param('gameId') gameId: string, @Param('playerId') playerId: string) {
    return await this.gamesService.removePlayer(parseInt(gameId), parseInt(playerId))
  }

  //create a new character for a game
  @Post('/:gameId/characters')
  @UseGuards(PlayerGameCharacterGuard)
  @Serialize(CharacterDetailDto)
  async createCharacter(
    @Param('gameId') gameId: string,
    @Body() body: CreateCharacterDto,
    @CurrentPlayer() player: Player
  ) {
    return await this.charactersService.createCharacter(
      parseInt(gameId),
      body.name,
      body.strength,
      body.dexterity,
      body.intelligence,
      player
    )
  }

  //get all characters for a game
  @Get('/:gameId/characters')
  @Serialize(CharacterDto)
  async findAllCharacters(@Param('gameId') gameId: string) {
    return await this.charactersService.findAllByGame(parseInt(gameId))
  }
}
