import { Test, TestingModule } from '@nestjs/testing'
import { MonstersService } from "./monsters.service.js"
import { Monster } from "./entities/monster.entity.js"
import { RandomService } from "../utils/random.service.js"

describe('MonstersService', () => {
  let service: MonstersService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: Monster, useValue: Monster },
        { provide: MonstersService, useValue: MonstersService },
        { provide: RandomService, useValue: RandomService }
      ]
    }).compile()

    service = module.get<MonstersService>(MonstersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
