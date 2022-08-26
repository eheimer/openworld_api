import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateGameDto } from './dto/create-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'
import { Player } from '../players/entities/player.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Game } from './entities/game.entity'
import { Repository } from 'typeorm'

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private readonly repo: Repository<Game>,
    @InjectRepository(Player) private readonly playerRepo: Repository<Player>
  ) {}

  async create(createGameDto: CreateGameDto, player: Player) {
    let game = await this.repo.findOneBy({ name: createGameDto.name, owner: player })
    if (game) {
      throw new BadRequestException('Game already exists')
    }
    game = await this.repo.create({ name: createGameDto.name, owner: player, players: [player] })
    return this.repo.save(game)
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['players', 'owner'] })
  }

  async update(id: number, updateGameDto: UpdateGameDto) {
    const storedGame = await this.repo.findOneBy({ id })
    if (!storedGame) {
      throw new NotFoundException('Game does not exist')
    }
    await this.repo.update(id, updateGameDto)
    return await this.findOne(id)
  }

  async remove(id: number) {
    const game = await this.repo.findOneBy({ id })
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    return await this.repo.remove(game)
  }

  async addPlayer(gameId: number, playerId: number) {
    const game = await this.findOne(gameId)
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    const player = await this.playerRepo.findOneBy({ id: playerId })
    if (!player) {
      throw new NotFoundException('Player not found')
    }
    game.players.push(player)
    return await this.repo.save(game)
  }

  async removePlayer(gameId: number, playerId: number) {
    const game = await this.findOne(gameId)
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    const player = await this.playerRepo.findOneBy({ id: playerId })
    if (!player) {
      throw new NotFoundException('Player not found')
    }
    game.players = game.players.filter((p) => p.id !== player.id)
    return await this.repo.save(game)
  }

  findWithPlayer(gameId: number, playerId: number) {
    return this.repo.findOne({
      where: { id: gameId, players: { id: playerId } },
      relations: ['players']
    })
  }
}
