import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Game } from './game.entity'
import { Repository } from 'typeorm'
import { Player } from '../players/player.entity'
import { CreateGameDto } from './dto/create-game.dto'

@Injectable()
export class GamesService {
  constructor(
    @InjectRepository(Game) private repo: Repository<Game>,
    @InjectRepository(Player) private playerRepo: Repository<Player>
  ) {}

  async create(name: string, owner: Player) {
    let game = await this.repo.findOneBy({ name, owner })
    if (game) {
      throw new BadRequestException('Game already exists')
    }
    game = await this.repo.create({ name, owner, players: [owner] })
    return this.repo.save(game)
  }

  async update(id: number, game: Partial<CreateGameDto>) {
    const storedGame = await this.repo.findOne({ where: { id } })
    if (!storedGame) {
      throw new BadRequestException('Game does not exist')
    }
    await this.repo.update(id, game)
    return await this.find(id)
  }

  async findAllByPlayer(player: Player): Promise<Game[]> {
    //retrieve all games where players array includes the player

    // const games = await this.repo.find({ where: { players: { id: player.id } }, relations: ['players', 'owner'] })
    const games = await this.repo.find({ where: { players: { id: player.id } }, relations: ['players', 'owner'] })
    return games
  }

  async find(id: number): Promise<Game> {
    return await this.repo.findOne({ where: { id }, relations: ['players', 'owner'] })
  }

  //async method to delete a game
  async delete(id: number): Promise<Game> {
    const game = await this.repo.findOne({ where: { id } })
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    return await this.repo.remove(game)
  }

  //async method to add a player to a game
  async addPlayer(gameId: number, playerId: number): Promise<Game> {
    const game = await this.repo.findOne({ where: { id: gameId }, relations: ['players'] })
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    const player = await this.playerRepo.findOne({ where: { id: playerId } })
    if (!player) {
      throw new NotFoundException('Player not found')
    }
    game.players.push(player)
    return await this.repo.save(game)
  }
}
