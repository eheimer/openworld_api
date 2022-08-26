import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CreateCharacterDto } from './dto/create-character.dto'
import { UpdateCharacterDto } from './dto/update-character.dto'
import { Character } from './entities/character.entity'
import { Repository } from 'typeorm'
import { Game } from '../games/entities/game.entity'
import { Player } from '../players/entities/player.entity'

@Injectable()
export class CharactersService {
  constructor(
    @InjectRepository(Character) private repo: Repository<Character>,
    @InjectRepository(Game) private gameRepo: Repository<Game>
  ) {}

  async create(gameId: number, player: Player, createCharacterDto: CreateCharacterDto) {
    const game = await this.gameRepo.findOne({ where: { id: gameId }, relations: ['players'] })
    if (!game) {
      throw new NotFoundException('Game not found')
    }
    const character = await this.repo.create({ ...createCharacterDto, game, player })
    return this.repo.save(character)
  }

  findOne(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['game', 'player'] })
  }

  async update(id: number, updateCharacterDto: UpdateCharacterDto) {
    const character = await this.repo.findOneBy({ id })
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    await this.repo.update(id, updateCharacterDto)
    return await this.findOne(id)
  }

  async remove(id: number) {
    const character = await this.repo.findOneBy({ id })
    if (!character) {
      throw new NotFoundException('Character not found')
    }
    return await this.repo.remove(character)
  }

  findByPlayerAndGame(playerId: number, gameId: number) {
    return this.repo.findOneBy({ player: { id: playerId }, game: { id: gameId } })
  }

  findAllByGame(gameId: number) {
    return this.repo.find({ where: { game: { id: gameId } }, relations: ['game', 'player'] })
  }
}