import { Module } from '@nestjs/common'
import { MapService } from "./map.service"
import { MapController } from "./map.controller"
import { TileData } from "./entities/tileData.entity"
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([TileData])],
  controllers: [MapController],
  providers: [MapService]
})
export class MapModule {}

