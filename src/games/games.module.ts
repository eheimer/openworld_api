import { Module } from '@nestjs/common'
import { GamesService } from './games.service'
import { GamesController } from './games.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Game } from './entities/game.entity'
import { CharactersModule } from '../characters/characters.module'
import { BattlesService } from './battles/battles.service'
import { BattlesController } from './battles/battles.controller'
import { Battle } from './battles/entities/battle.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Game, Battle]), CharactersModule],
  controllers: [GamesController, BattlesController],
  providers: [GamesService, BattlesService],
  exports: [GamesService, BattlesService]
})
export class GamesModule {}
