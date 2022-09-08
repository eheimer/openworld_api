import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ConditionsService } from './conditions.service';
import { CreateConditionDto } from './dto/create-condition.dto';
import { UpdateConditionDto } from './dto/update-condition.dto';

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService) {}

  @Post()
  create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionsService.create(createConditionDto);
  }

  @Get()
  findAll() {
    return this.conditionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conditionsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConditionDto: UpdateConditionDto) {
    return this.conditionsService.update(+id, updateConditionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conditionsService.remove(+id);
  }
}
