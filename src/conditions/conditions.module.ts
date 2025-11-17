import { Module } from '@nestjs/common'
import { ConditionsService } from "./conditions.service.js"
import { ConditionsController } from "./conditions.controller.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { Condition } from "./entities/condition.entity.js"

@Module({
  imports: [TypeOrmModule.forFeature([Condition])],
  controllers: [ConditionsController],
  providers: [ConditionsService]
})
export class ConditionsModule {}

(globalThis as any).ConditionsModule = ConditionsModule
