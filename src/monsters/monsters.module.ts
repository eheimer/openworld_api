import { Module } from '@nestjs/common'
import { MonstersService } from "./monsters.service"
import { MonstersController } from "./monsters.controller"
import { Monster } from "./entities/monster.entity"
import { TypeOrmModule } from '@nestjs/typeorm'
import { MonsterInstance } from "./entities/monster-instance.entity"
import { UtilsModule } from "../utils/utils.module"

@Module({
  imports: [TypeOrmModule.forFeature([Monster, MonsterInstance]), UtilsModule],
  controllers: [MonstersController],
  providers: [MonstersService],
  exports: [MonstersService]
})
export class MonstersModule {}

