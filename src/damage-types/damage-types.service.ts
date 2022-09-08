import { Injectable } from '@nestjs/common';
import { CreateDamageTypeDto } from './dto/create-damage-type.dto';
import { UpdateDamageTypeDto } from './dto/update-damage-type.dto';

@Injectable()
export class DamageTypesService {
  create(createDamageTypeDto: CreateDamageTypeDto) {
    return 'This action adds a new damageType';
  }

  findAll() {
    return `This action returns all damageTypes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} damageType`;
  }

  update(id: number, updateDamageTypeDto: UpdateDamageTypeDto) {
    return `This action updates a #${id} damageType`;
  }

  remove(id: number) {
    return `This action removes a #${id} damageType`;
  }
}
