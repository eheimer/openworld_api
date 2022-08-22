import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Player } from './player.entity'
import { Repository } from 'typeorm'
import { Character } from '../characters/character.entity'

@Injectable()
export class PlayersService {
  constructor(
    @InjectRepository(Player) private repo: Repository<Player>,
    @InjectRepository(Character) private characterRepo: Repository<Character>
  ) {}

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
