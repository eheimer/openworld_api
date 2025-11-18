import { Controller, Get } from '@nestjs/common'
import { MonstersService } from "./monsters.service.js"
import { Serialize } from "../interceptors/serialize.interceptor.js"
import { MonsterDto } from "./dto/monster.dto.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

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
