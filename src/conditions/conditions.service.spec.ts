import { Test, TestingModule } from '@nestjs/testing'
import { ConditionsService } from './conditions.service'

describe('ConditionsService', () => {
  let service: ConditionsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: ConditionsService, useValue: ConditionsService }]
    }).compile()

    service = module.get<ConditionsService>(ConditionsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
