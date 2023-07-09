import { Controller, Get, Post, Param, Delete, UseGuards, Body } from '@nestjs/common'
import { BattlesService } from './battles.service'
import { GamePlayerGuard } from '../../guards/authorization/game-player.guard'
import { Serialize } from '../../interceptors/serialize.interceptor'
import { BattleDto } from '../dto/battle.dto'
import { GamesService } from '../games.service'
import { CurrentPlayer } from '../../decorators/current-player.decorator'
import { Player } from '../../players/entities/player.entity'
import { GameOwnerGuard } from '../../guards/authorization/game-owner.guard'
import { MonstersService } from '../../monsters/monsters.service'
import { MonsterInstanceDto } from '../../monsters/dto/monster-instance.dto'
import { GameBattleGuard } from '../../guards/authorization/game-battle.guard'
import { CreateMonsterInstanceDto } from '../../monsters/dto/create-monster-instance.dto'
import { BattleInitiatorGuard } from 'src/guards/authorization/battle-initiator.guard'

@Controller('games/:gameId/battles')
@UseGuards(GamePlayerGuard)
export class BattlesController {
  constructor(
    private readonly battlesService: BattlesService,
    private readonly gamesService: GamesService,
    private readonly monstersService: MonstersService
  ) {}

  //get all battles for a game
  @Get('')
  @Serialize(BattleDto)
  async findAllBattles(@Param('gameId') gameId: string) {
    return (await this.gamesService.findWithBattles(+gameId)).battles
  }

  //create a new battle
  @Post('')
  @Serialize(BattleDto)
  async createBattle(@Param('gameId') gameId: string, @CurrentPlayer() player: Player) {
    return this.battlesService.create(+gameId, player.id)
  }

  //get a battle
  @Get(':battleId')
  @UseGuards(GameBattleGuard)
  @Serialize(BattleDto)
  async findBattle(@Param('gameId') gameId: string, @Param('battleId') battleId: string) {
    return this.battlesService.findOne(+battleId)
  }

  //delete a battle
  @Delete(':battleId')
  @UseGuards(GameOwnerGuard, GameBattleGuard)
  @Serialize(BattleDto)
  async deleteBattle(@Param('gameId') gameId: string, @Param('battleId') battleId: string) {
    return this.battlesService.remove(+battleId)
  }

  //join a battle
  @Post(':battleId/join')
  @UseGuards(GameBattleGuard)
  @Serialize(BattleDto)
  async joinBattle(
    @Param('gameId') gameId: string,
    @Param('battleId') battleId: string,
    @CurrentPlayer() player: Player
  ) {
    return this.battlesService.join(+battleId, player.id)
  }

  //add a monster to a battle
  @Post(':battleId/enemies')
  @UseGuards(GameBattleGuard)
  @Serialize(MonsterInstanceDto)
  async addEnemyToBattle(
    @Param('gameId') gameId: string,
    @Param('battleId') battleId: string,
    @Body() body: CreateMonsterInstanceDto
  ) {
    const instance = await this.monstersService.createInstance(+body.monsterId)
    await this.battlesService.addEnemyToBattle(+battleId, instance.id)
    return instance
  }

  //battle next round
  @Post(':battleId/nextround')
  @UseGuards(GameBattleGuard, BattleInitiatorGuard)
  @Serialize(BattleDto)
  async nextRound(@Param('battleId') battleId: string) {
    return this.battlesService.nextRound(+battleId)
  }
}
