import { Module } from '@nestjs/common'
import { PlayersService } from './players.service'
import { PlayersController } from './players.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Character } from '../characters/entities/character.entity'
import { Player } from './entities/player.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Player, Character])],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [PlayersService]
})
export class PlayersModule {}
