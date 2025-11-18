import { Test, TestingModule } from '@nestjs/testing'
import { ArmorController } from "./armor.controller.js"
import { ArmorService } from "./armor.service.js"

describe('ArmorController', () => {
  let controller: ArmorController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArmorController],
      providers: [{ provide: ArmorService, useValue: ArmorService }]
    }).compile()

    controller = module.get<ArmorController>(ArmorController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
