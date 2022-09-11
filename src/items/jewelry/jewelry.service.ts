import { Injectable } from '@nestjs/common'

@Injectable()
export class JewelryService {
  // create(createJewelryDto: CreateJewelryDto) {
  //   return 'This action adds a new jewelry'
  // }

  findAll() {
    return `This action returns all jewelry`
  }

  findOne(id: number) {
    return `This action returns a #${id} jewelry`
  }

  // update(id: number, updateJewelryDto: UpdateJewelryDto) {
  //   return `This action updates a #${id} jewelry`
  // }

  remove(id: number) {
    return `This action removes a #${id} jewelry`
  }
}
