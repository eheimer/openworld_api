import { Module } from '@nestjs/common'
import { GamesService } from './games.service'
import { GamesController } from './games.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CharactersModule } from '../characters/characters.module'
import { PlayersModule } from '../players/players.module'
import { Player } from '../players/entities/player.entity'
import { Game } from './entities/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Game, Player]), PlayersModule, CharactersModule],
  controllers: [GamesController],
  providers: [GamesService]
})
export class GamesModule {}
