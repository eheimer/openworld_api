import { Module } from '@nestjs/common'
import { GamesService } from './games.service'
import { GamesController } from './games.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Game } from './entities/game.entity'
import { CharactersModule } from '../characters/characters.module'
import { BattlesModule } from '../battles/battles.module'

@Module({
  imports: [TypeOrmModule.forFeature([Game]), CharactersModule, BattlesModule],
  controllers: [GamesController],
  providers: [GamesService],
  exports: [GamesService]
})
export class GamesModule {}
