import { Controller, Get, Param, Delete, Body, Logger } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { RandomItemRequestDto } from './dto/random-item-request.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { ItemInstanceDto } from './dto/item-instance.dto'

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

  @Get(':id/random')
  @Serialize(ItemInstanceDto)
  async randomItem(@Param('id') id: string, @Body() req: RandomItemRequestDto) {
    const ret = await this.inventoryService.randomItem(req.itemType, req.level)
    return ret
  }
}
