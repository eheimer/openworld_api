import { Module } from '@nestjs/common'
import { GamesService } from './games.service'
import { GamesController } from './games.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Game } from './game.entity'
import { Player } from '../players/player.entity'
import { PlayersModule } from '../players/players.module'
import { CharactersModule } from '../characters/characters.module'

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player]), PlayersModule, CharactersModule],
  providers: [GamesService],
  controllers: [GamesController],
  exports: [GamesService]
})
export class GamesModule {}
