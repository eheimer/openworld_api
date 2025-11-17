import { Test, TestingModule } from '@nestjs/testing'
import { InventoryController } from "./inventory.controller.js"
import { InventoryService } from "./inventory.service.js"
import { CharactersService } from "../games/characters/characters.service.js"

describe('InventoryController', () => {
  let controller: InventoryController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InventoryController],
      providers: [
        { provide: InventoryService, useValue: InventoryService },
        { provide: CharactersService, useValue: CharactersService }
      ]
    }).compile()

    controller = module.get<InventoryController>(InventoryController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
