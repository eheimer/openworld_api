import { Module } from '@nestjs/common'
import { MonstersService } from './monsters.service'
import { MonstersController } from './monsters.controller'
import { Monster } from './entities/monster.entity'
import { Action } from './entities/action.entity'
import { MonsterInstance } from './entities/monster-instance.entity'
import { MonsterAction } from './entities/monster-action.entity'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([Monster, Action, MonsterInstance, MonsterAction])],
  controllers: [MonstersController],
  providers: [MonstersService]
})
export class MonstersModule {}
