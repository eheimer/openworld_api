import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Skill } from "./entities/skill.entity.js"
import { Repository } from 'typeorm'
import { Race } from "../race/entities/race.entity.js"

@Injectable()
export class SkillsService {
  constructor(@InjectRepository(Skill) private repo: Repository<Race>) {}

  findAll() {
    return this.repo.find()
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id })
  }
}

(globalThis as any).SkillsService = SkillsService
