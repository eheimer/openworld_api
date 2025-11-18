import { Module } from '@nestjs/common'
import { MapService } from "./map.service.js"
import { MapController } from "./map.controller.js"
import { TileData } from "./entities/tileData.entity.js"
import { TypeOrmModule } from '@nestjs/typeorm'
import { getEntity, registerEntity } from "../entityRegistry.js"

@Module({
  imports: [TypeOrmModule.forFeature([TileData])],
  controllers: [MapController],
  providers: [MapService]
})
export class MapModule {}

registerEntity('MapModule', MapModule)
