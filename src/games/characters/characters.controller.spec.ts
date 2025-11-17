import { Test, TestingModule } from '@nestjs/testing'
import { CharactersController } from "./characters.controller.js"
import { CharactersService } from "./characters.service.js"
import { GamesService } from "../games.service.js"

describe('CharactersController', () => {
  let controller: CharactersController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CharactersController],
      providers: [
        { provide: CharactersService, useValue: CharactersService },
        { provide: GamesService, useValue: GamesService }
      ]
    }).compile()

    controller = module.get<CharactersController>(CharactersController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
