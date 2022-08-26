import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreatePlayerDto } from './dto/create-player.dto'
import { UpdatePlayerDto } from './dto/update-player.dto'
import { Player } from './entities/player.entity'
import { Repository } from 'typeorm'
import { Character } from '../characters/entities/character.entity'

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private repo: Repository<Player>,
    @InjectRepository(Character) private characterRepo: Repository<Character>
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

  /**
   * @description - Find all games that a player is in
   */
  async findAllGames(player: Player) {
    return (await this.repo.findOne({ where: { id: player.id }, relations: ['games', 'games.owner', 'games.players'] }))
      .games
  }

  async findAllGamesWithCharacter(player: Player) {
    //get all games that the player is in
    const games = await this.findAllGames(player)
    //for each game, create an object that contains the game and the character that the player has in that game
    const gameCharacters = await Promise.all(
      games.map(async (game) => {
        const character = await this.characterRepo.findOne({
          where: { game: { id: game.id }, player: { id: player.id } }
        })
        return {
          game: { id: game.id, name: game.name },
          character: { name: character?.name },
          owner: game.owner.id === player.id
        }
      })
    )
    return gameCharacters
  }
}
