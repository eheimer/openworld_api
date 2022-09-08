import { Injectable } from '@nestjs/common';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@Injectable()
export class ConditionsService {
  create(createConditionDto: CreateConditionDto) {
    return 'This action adds a new condition';
  }

  findAll() {
    return `This action returns all conditions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} condition`;
  }

  update(id: number, updateConditionDto: UpdateConditionDto) {
    return `This action updates a #${id} condition`;
  }

  remove(id: number) {
    return `This action removes a #${id} condition`;
  }
}
