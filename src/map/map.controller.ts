import { Controller, Get, Post, Body, Logger, Request } from '@nestjs/common'
import { MapService } from "./map.service.js"
import { Serialize } from "../interceptors/serialize.interceptor.js"
import { TileDataDto } from "./dto/tile-data.dto.js"
import { Public } from "../decorators/public-auth.decorator.js"

@Controller('map')
export class MapController {
  constructor(private readonly mapService: MapService) {}

  @Post()
  @Public()
  create(@Body() createMapDto: TileDataDto[]) {
    return this.mapService.create(createMapDto)
  }

  @Get()
  @Serialize(TileDataDto)
  @Public()
  findAll() {
    return this.mapService.findAll()
  }
}

(globalThis as any).MapController = MapController
