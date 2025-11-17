import { Test, TestingModule } from '@nestjs/testing'
import { MonstersController } from "./monsters.controller.js"
import { MonstersService } from "./monsters.service.js"
import { Monster } from "./entities/monster.entity.js"
import { RandomService } from "../utils/random.service.js"

describe('MonstersController', () => {
  let controller: MonstersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonstersController],
      providers: [
        { provide: Monster, useValue: Monster },
        { provide: MonstersService, useValue: MonstersService },
        { provide: RandomService, useValue: RandomService }
      ]
    }).compile()

    controller = module.get<MonstersController>(MonstersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
