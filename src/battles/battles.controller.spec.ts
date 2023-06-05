import { Test, TestingModule } from '@nestjs/testing'
import { BattlesController } from './battles.controller'
import { BattlesService } from './battles.service'

describe('BattlesController', () => {
  let controller: BattlesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BattlesController],
      providers: [{ provide: BattlesService, useValue: BattlesService }]
    }).compile()

    controller = module.get<BattlesController>(BattlesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
