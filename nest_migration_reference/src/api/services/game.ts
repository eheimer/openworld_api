import { DeepPartial } from 'typeorm'

import logger from '../../utils/logger'
import PublicCharacter from '../dto/PublicCharacter'
import GameFactory from '../factories/GameFactory'
import Battle from '../models/Battle'
import Game from '../models/Game'
import PlayerService from './player'
import BattleService from './battle'
import CharacterService from './character'

export abstract class GameService {
  static factory: GameFactory = new GameFactory()

  static async createGame(
    name: string,
    maxPlayers: number,
    owner: number | string
  ): Promise<{ gameId: number | string }> {
    try {
      const player = await PlayerService.factory.getRepository().findOne(owner)
      const game = await this.factory.create({
        name,
        maxPlayers,
        owner: player,
        players: [player]
      })
      return { gameId: game.id }
    } catch (err) {
      logger.error(`createGame: ${err}`)
      throw err
    }
  }

  static async updateGame(gameId: number | string, part: DeepPartial<Game>): Promise<void> {
    try {
      await this.factory.getRepository().update(gameId, part)
    } catch (err) {
      logger.error(`updateGame: ${err}`)
      throw err
    }
  }

  static async getGame(gameId: number | string): Promise<Game> {
    try {
      return await this.factory.getRepository().findOne(gameId)
    } catch (err) {
      logger.error(`getGame: ${err}`)
      throw err
    }
  }

  static async getGameWithRelations(gameId: number | string): Promise<Game> {
    try {
      return await this.factory.getRepository().findOne(gameId, { loadRelationIds: true })
    } catch (err) {
      logger.error(`getGameWithRelations: ${err}`)
      throw err
    }
  }

  static async deleteGame(gameId: string | number): Promise<void> {
    try {
      await this.factory.getRepository().delete(gameId)
    } catch (err) {
      logger.error(`deleteGame: ${err}`)
      throw err
    }
  }

  static async addPlayer(gameId: number | string, playerId: number | string): Promise<void> {
    try {
      const game = await this.factory.getRepository().findOne(gameId, { relations: ['players'] })
      const player = await PlayerService.factory.getRepository().findOne(playerId)
      if (game && player && !game.players.includes(player)) {
        game.players[game.players.length] = player
        await this.factory.getRepository().save(game)
      }
    } catch (err) {
      logger.error(`addPlayer: ${err}`)
      throw err
    }
  }

  static async removePlayer(gameId: number | string, playerId: number | string): Promise<void> {
    try {
      const game = await this.factory.getRepository().findOne(gameId, { relations: ['players'] })
      if (game) {
        const filtered = game.players.filter((item) => {
          return item.id.toString() != playerId.toString()
        })
        game.players = filtered
        await this.factory.getRepository().save(game)
      }
    } catch (err) {
      logger.error(`addPlayer: ${err}`)
      throw err
    }
  }

  static async getCharacters(gameId: number | string): Promise<PublicCharacter[]> {
    const characters = await CharacterService.factory.getRepository().find({ game: { id: gameId } })
    const pub: PublicCharacter[] = []
    for (const character of characters) {
      pub[pub.length] = new PublicCharacter(character)
    }
    return pub
  }

  static async getBattles(gameId: number | string): Promise<Battle[]> {
    const battles = await BattleService.factory.getRepository().find({ game: { id: gameId } })
    return battles
  }
}
export default GameService