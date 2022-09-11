import { Injectable } from '@nestjs/common'

@Injectable()
export class InventoryService {
  // create(createInventoryDto: CreateInventoryDto) {
  //   return 'This action adds a new inventory'
  // }

  findAll() {
    return `This action returns all inventory`
  }

  findOne(id: number) {
    return `This action returns a #${id} inventory`
  }

  // update(id: number, updateInventoryDto: UpdateInventoryDto) {
  //   return `This action updates a #${id} inventory`
  // }

  remove(id: number) {
    return `This action removes a #${id} inventory`
  }
}
