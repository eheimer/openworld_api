import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Race } from './entities/race.entity'
import { Repository } from 'typeorm'

@Injectable()
export class RaceService {
  constructor(@InjectRepository(Race) private repo: Repository<Race>) {}

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return `This action returns a #${id} race`
  }
}
