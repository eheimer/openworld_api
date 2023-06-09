import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { CreateGameDto } from './dto/create-game.dto'
import { UpdateGameDto } from './dto/update-game.dto'
import { Player } from '../players/entities/player.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Game } from './entities/game.entity'
import { Repository } from 'typeorm'

@Injectable()
export class GamesService {
  constructor(@InjectRepository(Game) private readonly repo: Repository<Game>) {}

  async create(createGameDto: CreateGameDto, player: Player) {
    let game = await this.repo.findOneBy({ name: createGameDto.name, owner: { id: player.id } })
    if (game) {
      throw new BadRequestException('Game already exists')
    }
    game = await this.repo.create({ name: createGameDto.name, owner: player, players: [player] })
    return this.repo.save(game)
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['players', 'owner', 'battles'] })
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
    game.players.push({ id: playerId } as any)
    return await this.repo.save(game)
  }

  async removePlayer(gameId: number, playerId: number) {
    const game = await this.findOne(gameId)
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    game.players = game.players.filter((p) => p.id !== playerId)
    return await this.repo.save(game)
  }

  findWithPlayers(gameId: number) {
    return this.repo.findOne({
      where: { id: gameId },
      relations: ['players']
    })
  }

  findWithPlayer(gameId: number, playerId: number) {
    return this.repo.findOne({
      where: { id: gameId, players: { id: playerId } },
      relations: ['players']
    })
  }

  findWithBattles(gameId: number) {
    return this.repo.findOne({
      where: { id: gameId },
      relations: ['battles']
    })
  }

  async findAllGamesWithCharacterForPlayer(playerId: number) {
    const games = await this.repo.find({
      where: { players: { id: playerId } },
      relations: ['characters', 'characters.player']
    })
    return games.map((game) => {
      const character = game.characters.find((c) => c.player.id === playerId)
      return { game, character }
    })
  }
}
