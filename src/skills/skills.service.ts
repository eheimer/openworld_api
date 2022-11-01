import { Injectable } from '@nestjs/common'

@Injectable()
export class SkillsService {
  // create(createSkillDto: CreateSkillDto) {
  //   return 'This action adds a new skill'
  // }

  findAll() {
    return `This action returns all skills`
  }

  findOne(id: number) {
    return `This action returns a #${id} skill`
  }

  // update(id: number, updateSkillDto: UpdateSkillDto) {
  //   return `This action updates a #${id} skill`
  // }

  remove(id: number) {
    return `This action removes a #${id} skill`
  }
}
