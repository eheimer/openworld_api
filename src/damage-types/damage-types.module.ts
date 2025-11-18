import { Module } from '@nestjs/common'
import { DamageTypesService } from "./damage-types.service.js"
import { DamageTypesController } from "./damage-types.controller.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { DamageType } from "./entities/damage-type.entity.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Module({
  imports: [TypeOrmModule.forFeature([DamageType])],
  controllers: [DamageTypesController],
  providers: [DamageTypesService]
})
export class DamageTypesModule {}

registerEntity('DamageTypesModule', DamageTypesModule)
