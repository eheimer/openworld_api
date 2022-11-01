import { Injectable } from '@nestjs/common'
import { CreateBattleDto } from './dto/create-battle.dto'
import { UpdateBattleDto } from './dto/update-battle.dto'
import { Battle } from './entities/battle.entity'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class BattlesService {
  constructor(@InjectRepository(Battle) private readonly repo: Repository<Battle>) {}

  create(createBattleDto: CreateBattleDto) {
    return 'This action adds a new battle'
  }

  findAll() {
    return `This action returns all battles`
  }

  findOne(id: number) {
    return `This action returns a #${id} battle`
  }

  update(id: number, updateBattleDto: UpdateBattleDto) {
    return `This action updates a #${id} battle`
  }

  remove(id: number) {
    return `This action removes a #${id} battle`
  }

  async createBattle(gameId: number, characterId: number) {
    const battle = await this.repo.create({
      game: { id: gameId },
      initiator: { id: characterId },
      participants: [{ id: characterId }]
    })
    return await this.repo.save(battle)
  }
}
