import { Module } from '@nestjs/common'
import { DamageTypesService } from "./damage-types.service"
import { DamageTypesController } from "./damage-types.controller"
import { TypeOrmModule } from '@nestjs/typeorm'
import { DamageType } from "./entities/damage-type.entity"
import { getEntity, registerEntity } from "../entityRegistry"

@Module({
  imports: [TypeOrmModule.forFeature([DamageType])],
  controllers: [DamageTypesController],
  providers: [DamageTypesService]
})
export class DamageTypesModule {}

registerEntity('DamageTypesModule', DamageTypesModule)
