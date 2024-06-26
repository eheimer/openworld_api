import { Controller, Get, Param, Delete } from '@nestjs/common'
import { WeaponsService } from './weapons.service'

@Controller('weapons')
export class WeaponsController {
  constructor(private readonly weaponsService: WeaponsService) {}

  // @Post()
  // create(@Body() createWeaponDto: CreateWeaponDto) {
  //   return this.weaponsService.create(createWeaponDto)
  // }

  @Get()
  findAll() {
    return this.weaponsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.weaponsService.findOne(+id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateWeaponDto: UpdateWeaponDto) {
  //   return this.weaponsService.update(+id, updateWeaponDto)
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.weaponsService.remove(+id)
  }
}
