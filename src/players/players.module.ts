import { Module } from '@nestjs/common'
import { PlayersService } from './players.service'
import { PlayersController } from './players.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Player } from './player.entity'
import { Character } from '../characters/character.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Player, Character])],
  providers: [PlayersService],
  controllers: [PlayersController],
  exports: [PlayersService]
})
export class PlayersModule {}
