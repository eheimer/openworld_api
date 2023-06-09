import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common'
import { Battle } from './entities/battle.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { CharactersService } from '../../characters/characters.service'
import { MonstersService } from '../../monsters/monsters.service'

@Injectable()
export class BattlesService {
  constructor(
    @InjectRepository(Battle) private readonly repo: Repository<Battle>,
    private readonly charactersService: CharactersService,
    private readonly monstersService: MonstersService
  ) {}

  async create(gameId: number, playerId: number) {
    const character = await this.charactersService.findByPlayerAndGame(playerId, +gameId)
    if (!character) {
      throw new BadRequestException('You must have a character to create a battle')
    }
    const battle = await this.repo.create({
      game: { id: gameId },
      initiator: { id: character.id },
      participants: [{ id: character.id }]
    })
    return await this.repo.save(battle)
  }

  findOne(battleId: number) {
    return this.repo.findOne({ where: { id: battleId }, relations: ['initiator', 'participants', 'enemies'] })
  }

  async remove(id: number) {
    const battle = await this.repo.findOneBy({ id })
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    return await this.repo.remove(battle)
  }

  async addEnemyToBattle(battleId: number, enemyId: number) {
    const battle = await this.repo.findOne({ where: { id: battleId }, relations: ['enemies'] })
    if (!battle) {
      throw new NotFoundException('Battle not found')
    }
    const enemy = await this.monstersService.findOneInstance(enemyId)
    if (!enemy) {
      throw new NotFoundException('Monster instance not found')
    }
    battle.enemies.push(enemy)
    return await this.repo.save(battle)
  }
}
