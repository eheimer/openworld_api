import { Module } from '@nestjs/common'
import { RaceService } from "./race.service.js"
import { RaceController } from "./race.controller.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { Race } from "./entities/race.entity.js"

@Module({
  imports: [TypeOrmModule.forFeature([Race])],
  controllers: [RaceController],
  providers: [RaceService]
})
export class RaceModule {}

(globalThis as any).RaceModule = RaceModule
