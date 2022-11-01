import { Module } from '@nestjs/common'
import { BattlesService } from './battles.service'
import { BattlesController } from './battles.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Battle } from './entities/battle.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Battle])],
  controllers: [BattlesController],
  providers: [BattlesService],
  exports: [BattlesService]
})
export class BattlesModule {}
