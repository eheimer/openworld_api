import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePlayerDto } from './dto/create-player.dto'
import { UpdatePlayerDto } from './dto/update-player.dto'
import { Player } from './entities/player.entity'
import { Repository } from 'typeorm'
import { CharactersService } from '../games/characters/characters.service'
import { Game } from '../games/entities/game.entity'

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private repo: Repository<Player>,
    @InjectRepository(Game) private gameRepo: Repository<Game>,
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
    // get all games where players contains the player id
    const games = await this.gameRepo.find({
      where: { players: { id: player.id } }
    })
    /* for each game, remove the player from players
     ** if there are no more players, remove the game
     ** if there are more players and the player is the owner, assign a new owner
     */
    for (const gameId of games.map((g) => g.id)) {
      const game = await this.gameRepo.findOne({ where: { id: gameId }, relations: ['players', 'owner'] })
      if (game.players.length === 1) {
        await this.gameRepo.remove(game)
      } else {
        game.players = game.players.filter((p) => p.id !== player.id)
        if (game.owner.id === player.id) {
          game.owner = game.players[0]
        }
        await this.gameRepo.save(game)
      }
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
