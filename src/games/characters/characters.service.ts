import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { InventoryService } from "../../items/inventory.service.js"
import { CreateCharacterDto } from "./dto/create-character.dto.js"
import { UpdateCharacterDto } from "./dto/update-character.dto.js"
import { Character } from "./entities/character.entity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private repo: Repository<Character>,
    private inventoryService: InventoryService
  ) {}

  async create(gameId: number, playerId: number, createCharacterDto: CreateCharacterDto): Promise<Character> {
    const inventory = await this.inventoryService.createInventory(true)
    const character = await this.repo.create({
      ...createCharacterDto,
      game: { id: gameId },
      player: { id: playerId },
      inventory,
      sleep: 1,
      hunger: 1,
      race: { id: createCharacterDto.raceId },
      hp: this.calcMaxHp(createCharacterDto.strength, 1),
      mana: this.calcMaxMana(createCharacterDto.intelligence, 1),
      stamina: this.calcMaxStamina(createCharacterDto.dexterity),
      skills: createCharacterDto.skills?.map((skill) => ({ skill: { id: skill.id }, level: skill.level }))
    })
    await this.repo.save(character)
    return await this.findOne(character.id)
  }

  findOne(id: number): Promise<Character> {
    return this.repo.findOne({ where: { id }, relations: ['game', 'player', 'inventory', 'race', 'skills.skill'] })
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto): Promise<Character> {
    const character = await this.repo.findOneBy({ id })
    if (!character) {
      throw new NotFoundException('Character not found')
    }
  await this.repo.update(id, updateCharacterDto as any)
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

  findOneByPlayerAndInventory(playerId: number, inventoryId: number): Promise<Character> {
    return this.repo.findOne({ where: { player: { id: playerId }, inventory: { id: inventoryId } } })
  }

  findOneByPlayer(playerId: number, characterId: number): Promise<Character> {
    return this.repo.findOne({ where: { player: { id: playerId }, id: characterId } })
  }

  findByPlayerAndGame(playerId: number, gameId: number): Promise<Character> {
    return this.repo.findOne({ where: { player: { id: playerId }, game: { id: gameId } }, relations: ['battle'] })
  }

  findAllByGame(gameId: number): Promise<Character[]> {
    return this.repo.find({ where: { game: { id: gameId } }, relations: ['game', 'player'] })
  }

  findOneWithBattle(id: number): Promise<Character> {
    return this.repo.findOne({ where: { id }, relations: ['player', 'race', 'battle', 'skills.skill', 'inventory'] })
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

registerEntity('CharactersService', CharactersService)
