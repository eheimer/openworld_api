import { Module } from '@nestjs/common'
import { CharactersService } from './characters.service'
import { CharactersController } from './characters.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Character } from './entities/character.entity'
import { ItemsModule } from '../items/items.module'

@Module({
  imports: [TypeOrmModule.forFeature([Character]), ItemsModule],
  controllers: [CharactersController],
  providers: [CharactersService],
  exports: [CharactersService]
})
export class CharactersModule {}
