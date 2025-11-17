import { Test, TestingModule } from '@nestjs/testing'
import { DamageTypesController } from "./damage-types.controller.js"
import { DamageTypesService } from "./damage-types.service.js"

describe('DamageTypesController', () => {
  let controller: DamageTypesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DamageTypesController],
      providers: [DamageTypesService]
    }).compile()

    controller = module.get<DamageTypesController>(DamageTypesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
