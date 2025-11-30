import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Race } from "./entities/race.entity"
import { Repository } from 'typeorm'
import { getEntity, registerEntity } from "../entityRegistry"

@Injectable()
export class RaceService {
  constructor(@InjectRepository(Race) private repo: Repository<Race>) {}

  findAll() {
    return this.repo.find({ relations: ['skills.skill'] })
  }

  findOne(id: number) {
    return `This action returns a #${id} race`
  }
}

registerEntity('RaceService', RaceService)
