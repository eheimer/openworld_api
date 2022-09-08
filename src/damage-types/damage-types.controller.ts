import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DamageTypesService } from './damage-types.service';
import { CreateDamageTypeDto } from './dto/create-damage-type.dto';
import { UpdateDamageTypeDto } from './dto/update-damage-type.dto';

@Controller('damage-types')
export class DamageTypesController {
  constructor(private readonly damageTypesService: DamageTypesService) {}

  @Post()
  create(@Body() createDamageTypeDto: CreateDamageTypeDto) {
    return this.damageTypesService.create(createDamageTypeDto);
  }

  @Get()
  findAll() {
    return this.damageTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.damageTypesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDamageTypeDto: UpdateDamageTypeDto) {
    return this.damageTypesService.update(+id, updateDamageTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.damageTypesService.remove(+id);
  }
}
