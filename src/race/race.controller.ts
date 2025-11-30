import { Controller, Get, Param } from '@nestjs/common'
import { Serialize } from "../interceptors/serialize.interceptor"
import { RaceDto } from "./dto/race.dto"
import { RaceService } from "./race.service"
import { getEntity, registerEntity } from "../entityRegistry"

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
