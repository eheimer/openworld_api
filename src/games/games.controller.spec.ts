import { Test, TestingModule } from '@nestjs/testing'
import { GamesController } from "./games.controller.js"
import { GamesService } from "./games.service.js"
import { CharactersService } from "./characters/characters.service.js"
import { BattlesService } from "./battles/battles.service.js"

describe('GamesController', () => {
  let controller: GamesController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GamesController],
      providers: [
        { provide: GamesService, useValue: GamesService },
        { provide: CharactersService, useValue: CharactersService },
        { provide: BattlesService, useValue: BattlesService }
      ]
    }).compile()

    controller = module.get<GamesController>(GamesController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
