import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CharactersModule } from '../characters/characters.module'
import { MonstersModule } from '../monsters/monsters.module'
import { UtilsModule } from '../utils/utils.module'
import { BattlesController } from './battles/battles.controller'
import { BattlesService } from './battles/battles.service'
import { Battle } from './battles/entities/battle.entity'
import { Game } from './entities/game.entity'
import { GamesController } from './games.controller'
import { GamesService } from './games.service'

@Module({
  imports: [TypeOrmModule.forFeature([Game, Battle]), CharactersModule, MonstersModule, UtilsModule],
  controllers: [GamesController, BattlesController],
  providers: [GamesService, BattlesService],
  exports: [GamesService, BattlesService]
})
export class GamesModule {}
