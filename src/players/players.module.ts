import { Module } from '@nestjs/common'
import { PlayersService } from './players.service'
import { PlayersController } from './players.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Player } from './entities/player.entity'
import { GamesModule } from '../games/games.module'

@Module({
  imports: [TypeOrmModule.forFeature([Player]), GamesModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService]
})
export class PlayersModule {}
