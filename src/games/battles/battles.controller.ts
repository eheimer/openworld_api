import { Controller, Get, Post, Param, Delete, UseGuards } from '@nestjs/common'
import { BattlesService } from './battles.service'
import { GamePlayerGuard } from '../../guards/authorization/game-player.guard'
import { Serialize } from '../../interceptors/serialize.interceptor'
import { BattleDto } from './dto/battle.dto'
import { GamesService } from '../games.service'
import { CurrentPlayer } from '../../decorators/current-player.decorator'
import { Player } from '../../players/entities/player.entity'
import { GameOwnerGuard } from '../../guards/authorization/game-owner.guard'

@Controller('games/:gameId/battles')
export class BattlesController {
  constructor(private readonly battlesService: BattlesService, private readonly gamesService: GamesService) {}

  //get all battles for a game
  @Get('')
  @UseGuards(GamePlayerGuard)
  @Serialize(BattleDto)
  async findAllBattles(@Param('gameId') gameId: string) {
    return (await this.gamesService.findWithBattles(+gameId)).battles
  }

  //create a new battle
  @Post('')
  @UseGuards(GamePlayerGuard)
  @Serialize(BattleDto)
  async createBattle(@Param('gameId') gameId: string, @CurrentPlayer() player: Player) {
    return this.battlesService.create(+gameId, player.id)
  }

  //get a battle
  @Get(':battleId')
  @UseGuards(GamePlayerGuard)
  @Serialize(BattleDto)
  async findBattle(@Param('gameId') gameId: string, @Param('battleId') battleId: string) {
    return this.battlesService.findOne(+battleId)
  }

  //delete a battle
  @Delete(':battleId')
  @UseGuards(GameOwnerGuard)
  @Serialize(BattleDto)
  async deleteBattle(@Param('gameId') gameId: string, @Param('battleId') battleId: string) {
    return this.battlesService.remove(+battleId)
  }
}
