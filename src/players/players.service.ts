import { Injectable, Logger, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePlayerDto } from "./dto/create-player.dto.js"
import { UpdatePlayerDto } from "./dto/update-player.dto.js"
import { Player } from "./entities/player.entity.js"
import { Repository } from 'typeorm'
import { CharactersService } from "../games/characters/characters.service.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private repo: Repository<Player>,
    private charactersService: CharactersService
  ) {}

  create(createPlayerDto: CreatePlayerDto) {
    const player = this.repo.create(createPlayerDto)
    return this.repo.save(player)
  }

  findAll() {
    return this.repo.find()
  }

  async findOne(id: number) {
    const player = await this.repo.findOneBy({ id })
    if (!player) {
      throw new NotFoundException('User not found')
    }
    return player
  }

  async update(id: number, updatePlayerDto: UpdatePlayerDto | Partial<Player>) {
    const player = await this.findOne(id)
    if (!player) {
      throw new NotFoundException('User not found')
    }
    Object.assign(player, updatePlayerDto)
    return this.repo.save(player)
  }

  async remove(id: number) {
    const player = await this.findOne(id)
    if (!player) {
      throw new NotFoundException('User not found')
    }
    return this.repo.remove(player)
  }

  async findOneByEmail(email: string) {
    const player = await this.repo.findOneBy({ email })
    return player
  }

  async findOneByUsername(username: string) {
    const player = await this.repo.findOneBy({ username })
    return player
  }
}

registerEntity('PlayersService', PlayersService)
