import { Module } from '@nestjs/common'
import { CharactersController } from './characters.controller'
import { CharactersService } from './characters.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Character } from './character.entity'
import { Game } from '../games/game.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Character, Game])],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService]
})
export class CharactersModule {}
