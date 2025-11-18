import { Controller, Get, Param, Delete } from '@nestjs/common'
import { JewelryService } from "./jewelry.service.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Controller('jewelry')
export class JewelryController {
  constructor(private readonly jewelryService: JewelryService) {}

  // @Post()
  // create(@Body() createJewelryDto: CreateJewelryDto) {
  //   return this.jewelryService.create(createJewelryDto)
  // }

  @Get()
  findAll() {
    return this.jewelryService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.jewelryService.findOne(+id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateJewelryDto: UpdateJewelryDto) {
  //   return this.jewelryService.update(+id, updateJewelryDto)
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.jewelryService.remove(+id)
  }
}

registerEntity('JewelryController', JewelryController)
