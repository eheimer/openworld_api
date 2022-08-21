import { Module } from '@nestjs/common'
import { GamesService } from './games.service'
import { GamesController } from './games.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Game } from './game.entity'
import { Player } from '../players/player.entity'
import { PlayersService } from '../players/players.service'

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player])],
  providers: [GamesService, PlayersService],
  controllers: [GamesController],
  exports: [GamesService]
})
export class GamesModule {}
