import { Test, TestingModule } from '@nestjs/testing'
import { RaceController } from "./race.controller.js"
import { RaceService } from "./race.service.js"

describe('RaceController', () => {
  let controller: RaceController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RaceController],
      providers: [{ provide: RaceService, useValue: RaceService }]
    }).compile()

    controller = module.get<RaceController>(RaceController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
