import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'
import { Repository } from 'typeorm'
import { InventoryService } from '../../items/inventory.service'
import { Battle } from '../battles/entities/battle.entity'
import { Inventory } from '../../items/entities/inventory.entity'

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private repo: Repository<Character>,
    @InjectRepository(Battle) private battleRepo: Repository<Battle>,
    @InjectRepository(Inventory) private inventoryRepo: Repository<Inventory>,
    private inventoryService: InventoryService
  ) {}

  async create(gameId: number, playerId: number, createCharacterDto: CreateCharacterDto) {
    const inventory = await this.inventoryService.createInventory(true)
    const character = await this.repo.create({
      ...createCharacterDto,
      game: { id: gameId },
      player: { id: playerId },
      race: { id: createCharacterDto.raceId },
      inventory
    })
    await this.repo.save(character)
    return this.findOne(character.id)
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['game', 'player', 'inventory', 'race'] })
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    const character = await this.repo.findOneBy({ id })
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    await this.repo.update(id, updateCharacterDto)
    return await this.findOne(id)
  }

  async remove(id: number) {
    const character = await this.repo.findOne({
      where: { id },
      relations: ['inventory']
    })
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    await this.repo.remove(character)
    return character
  }

  findByPlayerAndGame(playerId: number, gameId: number) {
    return this.repo.findOneBy({ player: { id: playerId }, game: { id: gameId } })
  }

  findAllByGame(gameId: number) {
    return this.repo.find({ where: { game: { id: gameId } }, relations: ['game', 'player'] })
  }

  findOneWithBattle(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['player', 'race', 'battle'] })
  }
}
