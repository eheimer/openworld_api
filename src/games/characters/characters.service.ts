import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InventoryService } from '../../items/inventory.service'
import { FinalizeCharacterDto } from './dto/finalize-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'
import { CreateCharacterDto } from './dto/create-character.dto'

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private repo: Repository<Character>,
    private inventoryService: InventoryService
  ) {}

  async create(gameId: number, playerId: number, createCharacterDto: CreateCharacterDto) {
    const inventory = await this.inventoryService.createInventory(true)
    const character = await this.repo.create({
      ...createCharacterDto,
      game: { id: gameId },
      player: { id: playerId },
      inventory,
      sleep: 1,
      hunger: 1,
      new: true
    })
    await this.repo.save(character)
    return this.findOne(character.id)
  }

  async finalize(id: number, finalizeCharacterDto: FinalizeCharacterDto) {
    const character = await this.repo.findOne({ where: { id }, relations: ['inventory'] })
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    if (!character.new) {
      throw new BadRequestException('Character already finalized')
    }
    await this.repo.update(id, {
      race: { id: finalizeCharacterDto.raceId },
      hp: this.calcMaxHp(finalizeCharacterDto.strength, 1),
      mana: this.calcMaxMana(finalizeCharacterDto.intelligence, 1),
      stamina: this.calcMaxStamina(finalizeCharacterDto.dexterity),
      new: false
    })
    return this.findOne(id)
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
    return this.repo.findOne({ where: { player: { id: playerId }, game: { id: gameId } }, relations: ['battle'] })
  }

  findAllByGame(gameId: number) {
    return this.repo.find({ where: { game: { id: gameId } }, relations: ['game', 'player'] })
  }

  findOneWithBattle(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['player', 'race', 'battle'] })
  }

  calcMaxHp(strength: number, hunger: number): number {
    const maxHp = (strength * 25 + 50) * Math.max(hunger, 0.25)
    return maxHp
  }

  calcInventorySize(strength: number): number {
    return strength * 5 + 10
  }

  calcMeleeDamage(strength: number): number {
    const meleeDmg = [1, 3, 4, 6]
    return meleeDmg[strength - 1]
  }

  calcMaxMana(intelligence: number, sleep: number): number {
    const maxMana = intelligence * 25 * Math.max(sleep, 0.25)
    return maxMana
  }

  calcSpellDamage(intelligence: number): number {
    const spellDmg = [0, 2, 3, 5]
    return spellDmg[intelligence - 1]
  }

  calcFocusBonus(intelligence: number): number {
    return intelligence * 2
  }

  calcMedBonus(intelligence: number): number {
    return this.calcFocusBonus(intelligence)
  }

  calcMaxStamina(dexterity: number): number {
    return dexterity * 25
  }

  calcCastingSpeed(dexterity: number): number {
    return dexterity * -1 + 1
  }

  calcSwingSpeed(dexterity: number): number {
    return dexterity * -1 + 1
  }

  calcHealSpeed(dexterity: number): number {
    return this.calcSwingSpeed(dexterity)
  }
}
