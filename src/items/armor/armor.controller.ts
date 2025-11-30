import { Controller, Get, Param, Delete } from '@nestjs/common'
import { ArmorService } from "./armor.service"
import { getEntity, registerEntity } from "../../entityRegistry"

@Controller('armor')
export class ArmorController {
  constructor(private readonly armorService: ArmorService) {}

  // @Post()
  // create(@Body() createArmorDto: CreateArmorDto) {
  //   return this.armorService.create(createArmorDto)
  // }

  @Get()
  findAll() {
    return this.armorService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.armorService.findOne(+id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateArmorDto: UpdateArmorDto) {
  //   return this.armorService.update(+id, updateArmorDto)
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.armorService.remove(+id)
  }
}

registerEntity('ArmorController', ArmorController)
