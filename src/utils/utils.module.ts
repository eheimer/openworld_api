import { Module } from '@nestjs/common'
import { RandomService } from "./random.service"
import { getEntity, registerEntity } from "../entityRegistry"

@Module({
  controllers: [],
  providers: [RandomService],
  exports: [RandomService]
})
export class UtilsModule {}

registerEntity('UtilsModule', UtilsModule)
