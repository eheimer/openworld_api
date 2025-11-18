import { Controller, Get, Param } from '@nestjs/common'
import { Serialize } from "../interceptors/serialize.interceptor.js"
import { RaceDto } from "./dto/race.dto.js"
import { RaceService } from "./race.service.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Controller('race')
export class RaceController {
  constructor(private readonly raceService: RaceService) {}

  @Get()
  @Serialize(RaceDto)
  findAll() {
    return this.raceService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.raceService.findOne(+id)
  }
}

registerEntity('RaceController', RaceController)
