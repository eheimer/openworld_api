import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Player } from './player.entity'
import { Repository } from 'typeorm'

@Injectable()
export class PlayersService {
  constructor(@InjectRepository(Player) private repo: Repository<Player>) {}

  create(username: string, email: string, password: string) {
    const player = this.repo.create({ username, email, password })
    return this.repo.save(player)
  }

  async findAll() {
    return await this.repo.find()
  }

  async findOne(id: number) {
    const player = await this.repo.findOneBy({ id })
    if (!player) {
      throw new NotFoundException('User not found')
    }
    return player
  }

  /**
   * @description - Find a single player by email
   */
  async findByEmail(email: string) {
    const player = await this.repo.findOneBy({ email })
    return player
  }

  /**
   * @description - Find a single player by username
   */
  async findByUsername(username: string) {
    const player = await this.repo.findOneBy({ username })
    return player
  }

  async update(id: number, attrs: Partial<Player>) {
    const player = await this.findOne(id)
    if (!player) {
      throw new NotFoundException('User not found')
    }
    Object.assign(player, attrs)
    return this.repo.save(player)
  }

  async remove(id: number) {
    const player = await this.findOne(id)
    if (!player) {
      throw new NotFoundException('User not found')
    }
    return this.repo.remove(player)
  }
}
