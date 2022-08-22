import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Player } from 'src/players/player.entity'
import { Character } from './character.entity'
import { Repository } from 'typeorm'
import { Game } from '../games/game.entity'

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private repo: Repository<Character>,
    @InjectRepository(Game) private gameRepo: Repository<Game>
  ) {}

  async createCharacter(
    gameId: number,
    name: string,
    strength: number,
    dexterity: number,
    intelligence: number,
    player: Player
  ) {
    const game = await this.gameRepo.findOne({ where: { id: gameId }, relations: ['players'] })
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    const character = await this.repo.create({
      name,
      strength,
      dexterity,
      intelligence,
      game,
      player
    })
    return this.repo.save(character)
  }

  async find(id: number): Promise<Character> {
    return await this.repo.findOne({ where: { id }, relations: ['player'] })
  }

  async findByPlayerAndGame(playerId: number, gameId: number): Promise<Character> {
    return await this.repo.findOneBy({ player: { id: playerId }, game: { id: gameId } })
  }

  async findAllByGame(gameId: number): Promise<Character[]> {
    return this.repo.find({ where: { game: { id: gameId } } })
  }

  async delete(id: number): Promise<Character> {
    const character = await this.repo.findOne({ where: { id } })
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    return await this.repo.remove(character)
  }
}
