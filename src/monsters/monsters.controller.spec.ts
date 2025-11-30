import { Test, TestingModule } from '@nestjs/testing'
import { MonstersController } from "./monsters.controller"
import { MonstersService } from "./monsters.service"
import { Monster } from "./entities/monster.entity"
import { RandomService } from "../utils/random.service"

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
