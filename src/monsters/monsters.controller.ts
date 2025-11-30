import { Controller, Get } from '@nestjs/common'
import { MonstersService } from "./monsters.service"
import { Serialize } from "../interceptors/serialize.interceptor"
import { MonsterDto } from "./dto/monster.dto"
import { getEntity, registerEntity } from "../entityRegistry"

@Controller('monsters')
export class MonstersController {
  constructor(private readonly monstersService: MonstersService) {}

  @Get('')
  @Serialize(MonsterDto)
  async findAll() {
    return await this.monstersService.findAll()
  }
}

registerEntity('MonstersController', MonstersController)
