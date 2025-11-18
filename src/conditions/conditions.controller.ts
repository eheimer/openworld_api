import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { ConditionsService } from "./conditions.service.js"
import { CreateConditionDto } from "./dto/create-condition.dto.js"
import { UpdateConditionDto } from "./dto/update-condition.dto.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Controller('conditions')
export class ConditionsController {
  constructor(private readonly conditionsService: ConditionsService) {}

  @Post()
  create(@Body() createConditionDto: CreateConditionDto) {
    return this.conditionsService.create(createConditionDto)
  }

  @Get()
  async findAll() {
    const conditions = await this.conditionsService.findAll()
    //dereference the overrides array on each condition to just return the names
    //wow, copilot wrote this just from the comment above
    return conditions.map((condition) => {
      return {
        ...condition,
        overrides: condition.overrides.map((override) => override.name)
      }
    })
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.conditionsService.findOne(+id)
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateConditionDto: UpdateConditionDto) {
    return this.conditionsService.update(+id, updateConditionDto)
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.conditionsService.remove(+id)
  }
}

registerEntity('ConditionsController', ConditionsController)
