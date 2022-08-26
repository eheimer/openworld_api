import { Module } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { CharactersController } from './characters.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Game } from '../games/entities/game.entity'
import { Character } from './entities/character.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Character, Game])],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService]
})
export class CharactersModule {}
