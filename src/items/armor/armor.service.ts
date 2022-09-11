import { Injectable } from '@nestjs/common'

@Injectable()
export class ArmorService {
  // create(createArmorDto: CreateArmorDto) {
  //   return 'This action adds a new armor'
  // }

  findAll() {
    return `This action returns all armor`
  }

  findOne(id: number) {
    return `This action returns a #${id} armor`
  }

  // update(id: number, updateArmorDto: UpdateArmorDto) {
  //   return `This action updates a #${id} armor`
  // }

  remove(id: number) {
    return `This action removes a #${id} armor`
  }
}
