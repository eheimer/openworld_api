import { Test, TestingModule } from '@nestjs/testing'
import { GamesController } from './games.controller'
import { GamesService } from './games.service'
import { CharactersService } from '../characters/characters.service'
import { BattlesService } from '../battles/battles.service'

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
