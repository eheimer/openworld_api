import { Controller, Get, Post, Param, Delete } from '@nestjs/common'
import { SkillsService } from "./skills.service.js"

@Controller('skills')
export class SkillsController {
  constructor(private readonly skillsService: SkillsService) {}

  @Get()
  findAll() {
    return this.skillsService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.skillsService.findOne(+id)
  }
}

(globalThis as any).SkillsController = SkillsController
