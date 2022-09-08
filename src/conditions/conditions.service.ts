import { Injectable } from '@nestjs/common'
import { CreateConditionDto } from './dto/create-condition.dto'
import { UpdateConditionDto } from './dto/update-condition.dto'
import { Condition } from './entities/condition.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ConditionsService {
  constructor(@InjectRepository(Condition) private repo: Repository<Condition>) {}

  create(createConditionDto: CreateConditionDto) {
    return 'This action adds a new condition'
  }

  findAll() {
    return this.repo.find({ relations: ['overrides'] })
  }

  findOne(id: number) {
    return `This action returns a #${id} condition`
  }

  update(id: number, updateConditionDto: UpdateConditionDto) {
    return `This action updates a #${id} condition`
  }

  remove(id: number) {
    return `This action removes a #${id} condition`
  }
}
