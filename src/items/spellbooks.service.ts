import { Injectable } from '@nestjs/common';
import { CreateSpellbookDto } from './dto/create-spellbook.dto';
import { UpdateSpellbookDto } from './dto/update-spellbook.dto';

@Injectable()
export class SpellbooksService {
  create(createSpellbookDto: CreateSpellbookDto) {
    return 'This action adds a new spellbook';
  }

  findAll() {
    return `This action returns all spellbooks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} spellbook`;
  }

  update(id: number, updateSpellbookDto: UpdateSpellbookDto) {
    return `This action updates a #${id} spellbook`;
  }

  remove(id: number) {
    return `This action removes a #${id} spellbook`;
  }
}
