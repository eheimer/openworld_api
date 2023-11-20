import { Controller, Get, Param, Delete, Body, Logger, Post } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { RandomItemRequestDto } from './dto/random-item-request.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { InventoryDto } from './dto/inventory.dto'

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Get()
  findAll() {
    return this.inventoryService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inventoryService.findOne(+id)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(+id)
  }

  @Post(':id/random')
  @Serialize(InventoryDto)
  async randomItem(@Param('id') id: string, @Body() req: RandomItemRequestDto) {
    return await this.inventoryService.addItemToInventory(
      parseInt(id),
      await this.inventoryService.randomItem(req.itemType, req.level)
    )
  }
}
