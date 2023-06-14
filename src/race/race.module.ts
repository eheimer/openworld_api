import { Module } from '@nestjs/common'
import { RaceService } from './race.service'
import { RaceController } from './race.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Race } from './entities/race.entity'

@Module({
  imports: [TypeOrmModule.forFeature([Race])],
  controllers: [RaceController],
  providers: [RaceService]
})
export class RaceModule {}
