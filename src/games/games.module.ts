import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { MonstersModule } from "../monsters/monsters.module.js"
import { UtilsModule } from "../utils/utils.module.js"
import { BattlesController } from "./battles/battles.controller.js"
import { Battle } from "./battles/entities/battle.entity.js"
import { Game } from "./entities/game.entity.js"
import { GamesController } from "./games.controller.js"
import { GamesService } from "./games.service.js"
import { CharactersController } from "./characters/characters.controller.js"
import { Character } from "./characters/entities/character.entity.js"
import { CharactersService } from "./characters/characters.service.js"
import { BattlesService } from "./battles/battles.service.js"
import { ItemsModule } from "../items/items.module.js"
import { Inventory } from "../items/entities/inventory.entity.js"

@Module({
  imports: [TypeOrmModule.forFeature([Game, Battle, Character, Inventory]), MonstersModule, UtilsModule, ItemsModule],
  controllers: [GamesController, BattlesController, CharactersController],
  providers: [GamesService, BattlesService, CharactersService],
  exports: [GamesService, BattlesService, CharactersService]
})
export class GamesModule {}

(globalThis as any).GamesModule = GamesModule
