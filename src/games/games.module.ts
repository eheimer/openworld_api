import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MonstersModule } from "../monsters/monsters.module"
import { UtilsModule } from "../utils/utils.module"
import { BattlesController } from "./battles/battles.controller"
import { Battle } from "./battles/entities/battle.entity"
import { Game } from "./entities/game.entity"
import { GamesController } from "./games.controller"
import { GamesService } from "./games.service"
import { CharactersController } from "./characters/characters.controller"
import { Character } from "./characters/entities/character.entity"
import { CharactersService } from "./characters/characters.service"
import { BattlesService } from "./battles/battles.service"
import { ItemsModule } from "../items/items.module"
import { Inventory } from "../items/entities/inventory.entity"
import { getEntity, registerEntity } from "../entityRegistry"

@Module({
  imports: [TypeOrmModule.forFeature([Game, Battle, Character, Inventory]), MonstersModule, UtilsModule, ItemsModule],
  controllers: [GamesController, BattlesController, CharactersController],
  providers: [GamesService, BattlesService, CharactersService],
  exports: [GamesService, BattlesService, CharactersService]
})
export class GamesModule {}

registerEntity('GamesModule', GamesModule)
