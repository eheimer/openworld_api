import { Module } from '@nestjs/common'
import { PlayersService } from './players.service'
import { PlayersController } from './players.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Player } from './entities/player.entity'
import { CharactersModule } from '../characters/characters.module'

@Module({
  imports: [TypeOrmModule.forFeature([Player]), CharactersModule],
  controllers: [PlayersController],
  providers: [PlayersService],
  exports: [PlayersService]
})
export class PlayersModule {}
