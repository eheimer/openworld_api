import { Module } from '@nestjs/common';
import { DamageTypesService } from './damage-types.service';
import { DamageTypesController } from './damage-types.controller';

@Module({
  controllers: [DamageTypesController],
  providers: [DamageTypesService]
})
export class DamageTypesModule {}
