import { Controller, Get, Param, Delete, Body, Post, Put, UseGuards, NotFoundException } from '@nestjs/common'
import { InventoryService } from './inventory.service'
import { RandomItemRequestDto } from './dto/random-item-request.dto'
import { Serialize } from 'src/interceptors/serialize.interceptor'
import { InventoryDto } from './dto/inventory.dto'
import { InventoryOwnerGuard } from '../guards/authorization/inventory-owner.guard'

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
  @UseGuards(InventoryOwnerGuard)
  async randomItem(@Param('id') id: string, @Body() req: RandomItemRequestDto) {
    return await this.inventoryService.addItemToInventory(
      parseInt(id),
      await this.inventoryService.randomItem(req.itemType, req.level)
    )
  }

  @Put(':inventoryId/drop/:itemType/:itemId')
  @Serialize(InventoryDto)
  @UseGuards(InventoryOwnerGuard)
  async dropItem(
    @Param('inventoryId') inventoryId: string,
    @Param('itemType') itemType: string,
    @Param('itemId') itemId: string
  ) {
    // even though this appears to be a DELETE operation, eventually this method will create a new inventory
    // and add the dropped item to it.  So PUT is more appropriate in the long run.
    const inventory = await this.inventoryService.dropItemFromInventory(
      parseInt(inventoryId),
      itemType,
      parseInt(itemId)
    )
    if (!inventory) {
      throw new NotFoundException(`Item ${itemId} not found in Inventory ${inventoryId}`)
    }
    return inventory
  }
}
