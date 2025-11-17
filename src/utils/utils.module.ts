import { Module } from '@nestjs/common'
import { RandomService } from "./random.service.js"

@Module({
  controllers: [],
  providers: [RandomService],
  exports: [RandomService]
})
export class UtilsModule {}

(globalThis as any).UtilsModule = UtilsModule
