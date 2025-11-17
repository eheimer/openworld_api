import { Module } from '@nestjs/common'
import { MonstersService } from "./monsters.service.js"
import { MonstersController } from "./monsters.controller.js"
import { Monster } from "./entities/monster.entity.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { MonsterInstance } from "./entities/monster-instance.entity.js"
import { UtilsModule } from "../utils/utils.module.js"

@Module({
  imports: [TypeOrmModule.forFeature([Monster, MonsterInstance]), UtilsModule],
  controllers: [MonstersController],
  providers: [MonstersService],
  exports: [MonstersService]
})
export class MonstersModule {}

(globalThis as any).MonstersModule = MonstersModule
