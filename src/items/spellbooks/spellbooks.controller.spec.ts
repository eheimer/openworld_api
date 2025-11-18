import { Test, TestingModule } from '@nestjs/testing'
import { SpellbooksController } from "./spellbooks.controller.js"
import { SpellbooksService } from "./spellbooks.service.js"

describe('SpellbooksController', () => {
  let controller: SpellbooksController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpellbooksController],
      providers: [SpellbooksService]
    }).compile()

    controller = module.get<SpellbooksController>(SpellbooksController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
