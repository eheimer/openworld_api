import { Test, TestingModule } from '@nestjs/testing'
import { SkillsService } from "./skills.service.js"

describe('SkillsService', () => {
  let service: SkillsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: SkillsService, useValue: SkillsService }]
    }).compile()

    service = module.get<SkillsService>(SkillsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
