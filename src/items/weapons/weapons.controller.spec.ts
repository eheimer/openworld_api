import { Test, TestingModule } from '@nestjs/testing'
import { WeaponsController } from "./weapons.controller.js"
import { WeaponsService } from "./weapons.service.js"

describe('WeaponsController', () => {
  let controller: WeaponsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WeaponsController],
      providers: [{ provide: WeaponsService, useValue: WeaponsService }]
    }).compile()

    controller = module.get<WeaponsController>(WeaponsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
