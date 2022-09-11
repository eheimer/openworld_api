import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common'
import { SpellbooksService } from './spellbooks.service'

@Controller('spellbooks')
export class SpellbooksController {
  constructor(private readonly spellbooksService: SpellbooksService) {}

  // @Post()
  // create(@Body() createSpellbookDto: CreateSpellbookDto) {
  //   return this.spellbooksService.create(createSpellbookDto)
  // }

  @Get()
  findAll() {
    return this.spellbooksService.findAll()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.spellbooksService.findOne(+id)
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateSpellbookDto: UpdateSpellbookDto) {
  //   return this.spellbooksService.update(+id, updateSpellbookDto)
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.spellbooksService.remove(+id)
  }
}
