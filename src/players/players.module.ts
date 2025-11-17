import { Module } from '@nestjs/common'
import { PlayersService } from "./players.service.js"
import { PlayersController } from "./players.controller.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { Player } from "./entities/player.entity.js"
import { GamesModule } from "../games/games.module.js"
import { Game } from "../games/entities/game.entity.js"

@Module({
  imports: [TypeOrmModule.forFeature([Player, Game]), GamesModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService]
})
export class PlayersModule {}

(globalThis as any).PlayersModule = PlayersModule
