import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { CurrentPlayer } from 'src/decorators/current-player.decorator'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { Player } from 'src/players/player.entity'
import { CreateGameDto } from './dto/create-game.dto'
import { GamesService } from './games.service'
import { GameDto } from './dto/game.dto'
import { GameOwnerGuard } from 'src/guards/game-owner.guard'
import { PlayersService } from '../players/players.service'

@Controller('games')
export class GamesController {
  constructor(private gamesService: GamesService, private playersService: PlayersService) {}

  @Post('/')
  create(@Body() body: CreateGameDto, @CurrentPlayer() player: Player) {
    return this.gamesService.create(body.name, player)
  }

  //TODO: need an authorization guard - can only call if current player is the game owner
  @Patch('/:gameId')
  @Serialize(GameDto)
  @UseGuards(GameOwnerGuard)
  update(@Body() body: Partial<CreateGameDto>, @CurrentPlayer() player: Player, @Param('gameId') id: string) {
    return this.gamesService.update(parseInt(id), body)
  }

  @Get('/')
  @Serialize(GameDto)
  /**
   * retrieve the games that the player is part of
   */
  async findAll(@CurrentPlayer() player: Player) {
    return await this.playersService.findAllGames(player)
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
  //TODO: need an authorization guard - can only call if current player is the game owner
  @Delete('/:gameId')
  @UseGuards(GameOwnerGuard)
  async delete(@Param('gameId') id: string) {
    return await this.gamesService.delete(parseInt(id))
  }

  //add a player to a game
  //TODO: need an authorization guard - can only call if current player is the game owner
  @Post('/:gameId/players/:playerId')
  @UseGuards(GameOwnerGuard)
  async addPlayer(@Param('gameId') gameId: string, @Param('playerId') playerId: string) {
    return await this.gamesService.addPlayer(parseInt(gameId), parseInt(playerId))
  }
}
