import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Inventory } from './entities/inventory.entity'
import { Repository } from 'typeorm'

@Injectable()
export class InventoryService {
  constructor(@InjectRepository(Inventory) private repo: Repository<Inventory>) {}

  // create(createInventoryDto: CreateInventoryDto) {
  //   return 'This action adds a new inventory'
  // }

  findAll() {
    return this.repo.find()
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

  createInventory(limit: boolean) {
    const inventory = this.repo.create({ limit })
    return this.repo.save(inventory)
  }
}
