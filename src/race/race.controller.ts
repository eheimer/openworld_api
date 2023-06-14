import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { RaceService } from './race.service'
import { RaceDto } from './dto/race.dto'
import { Serialize } from '../interceptors/serialize.interceptor'

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
