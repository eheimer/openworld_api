import { Module } from '@nestjs/common'
import { RandomService } from "./random.service.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Module({
  controllers: [],
  providers: [RandomService],
  exports: [RandomService]
})
export class UtilsModule {}

registerEntity('UtilsModule', UtilsModule)
