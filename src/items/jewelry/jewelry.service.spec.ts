import { Test, TestingModule } from '@nestjs/testing'
import { JewelryService } from './jewelry.service'

describe('JewelryService', () => {
  let service: JewelryService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: JewelryService, useValue: JewelryService }]
    }).compile()

    service = module.get<JewelryService>(JewelryService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
