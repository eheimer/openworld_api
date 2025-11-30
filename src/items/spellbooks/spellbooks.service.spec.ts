import { Test, TestingModule } from '@nestjs/testing'
import { SpellbooksService } from "./spellbooks.service"

describe('SpellbooksService', () => {
  let service: SpellbooksService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpellbooksService]
    }).compile()

    service = module.get<SpellbooksService>(SpellbooksService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
