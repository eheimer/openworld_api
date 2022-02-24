import { CreatePlayerResponse } from '../../../types'
import logger from '../../utils/logger'
import GameCharacter from '../dto/GameCharacter'
import UserFactory from '../factories/UserFactory'
import Game from '../models/Game'
import GameDTO from '../dto/Game'
import PublicCharacter from '../dto/PublicCharacter'
import User from '../models/User'
import CharacterService from './character'

export abstract class PlayerService {
  static factory: UserFactory = new UserFactory()

  static async createPlayer(email: string, password: string, name: string): Promise<CreatePlayerResponse> {
    try {
      const found = await this.factory.getRepository().findOne({ email })
      if (found)
        return {
          error: {
            type: 'account_already_exists',
            message: `${email} already exists`
          }
        }

      const user = await this.factory.create({ email, name, password })
      if (user) {
        return { playerId: user.id }
      }
    } catch (err) {
      logger.error(`createPlayer: ${err}`)
      throw err
    }
  }

  static async updatePlayerLastSeen(playerId: number | string, when?: Date): Promise<void> {
    if (!when) {
      when = new Date(Date.now())
    }
    try {
      await this.factory.getRepository().update(playerId, { lastSeenAt: when })
    } catch (err) {
      logger.error(`updatePlayerLastSeen: ${err}`)
      throw err
    }
  }

  static async getPlayer(playerId: number | string): Promise<User> {
    try {
      return await this.factory.getRepository().findOne(playerId)
    } catch (err) {
      logger.error(`getPlayer: ${err}`)
      throw err
    }
  }

  static async findPlayerWithEmail(email: string): Promise<User> {
    try {
      return await this.factory.getRepository().findOne({ email: email })
    } catch (err) {
      logger.error(`findPlayerWithEmail: ${err}`)
      throw err
    }
  }

  static async getPlayerWithGames(playerId: number | string): Promise<User> {
    try {
      return await this.factory.getRepository().findOne(playerId, { relations: ['games', 'games.owner'] })
    } catch (err) {
      logger.error(`getPlayerWithGames: ${err}`)
      throw err
    }
  }

  static async getGameCharacters(playerId: number | string): Promise<GameCharacter[]> {
    try {
      const games: Game[] = (await this.getPlayerWithGames(playerId)).games
      const gameChars: GameCharacter[] = []
      for (const game of games) {
        const char = await CharacterService.factory.getRepository().findOne({ player: { id: playerId }, game: game })
        gameChars.push(
          new GameCharacter({
            game: new GameDTO(game),
            character: char ? new PublicCharacter(char) : new PublicCharacter({}),
            owner: game.owner.id === playerId
          })
        )
      }
      return gameChars
    } catch (err) {
      logger.error(`getGameCharacters: ${err}`)
      throw err
    }
  }

  static async getPlayerWithRelations(playerId: number | string): Promise<User> {
    try {
      return await this.factory.getRepository().findOne(playerId, { loadRelationIds: true })
    } catch (err) {
      logger.error(`getPlayerWithRelations: ${err}`)
      throw err
    }
  }
}

export default PlayerService
