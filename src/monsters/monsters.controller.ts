import { Controller, Post, Body } from '@nestjs/common'
import { MonstersService } from './monsters.service'
import { CreateMonsterDto } from './dto/create-monster.dto'

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Post()
  create(@Body() createMonsterDto: CreateMonsterDto) {
    return this.monstersService.create(createMonsterDto)
  }
}
