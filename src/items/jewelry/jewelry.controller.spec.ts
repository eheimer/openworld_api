import { Test, TestingModule } from '@nestjs/testing'
import { JewelryController } from './jewelry.controller'
import { JewelryService } from './jewelry.service'

describe('JewelryController', () => {
  let controller: JewelryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JewelryController],
      providers: [{ provide: JewelryService, useValue: JewelryService }]
    }).compile()

    controller = module.get<JewelryController>(JewelryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
