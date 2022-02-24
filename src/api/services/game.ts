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

  static async deleteGame(gameId: string): Promise<void> {
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

  /**
   * Validates that playerId is the game owner
   */
  static async authorizeOwner(gameId: number | string, playerId: number | string): Promise<Game | { error }> {
    try {
      const game = await this.factory.getRepository().findOne(gameId, { loadRelationIds: true })
      if (!game) {
        return
      }
      if (game.owner.toString() === playerId.toString()) {
        return game
      } else {
        return { error: 'unauthorized' }
      }
    } catch (err) {
      logger.error(`authorizeOwner: ${err}`)
      throw err
    }
  }

  /**
   * Validates that playerId is a member of the game
   *
   * @param gameId
   * @param playerId
   */
  static async authorizeMember(gameId: number | string, playerId: number | string): Promise<Game | { error }> {
    try {
      let game = await this.authorizeOwner(gameId, playerId)
      if (!game || (game as { error }).error) {
        game = await this.factory.getRepository().findOne(gameId, { loadRelationIds: true })
      }
      if (!game) {
        return
      }
      if (((game as Game).players as any).includes(playerId)) {
        return game
      } else {
        return { error: 'unauthorized' }
      }
    } catch (err) {
      logger.error(`authorizeMember: ${err}`)
      throw err
    }
  }

  /**
   * Validates that playerId and characterId are in the same game
   *
   * @param playerId
   * @param characterId
   */
  static async authorizePlayerCharacter(
    characterId: number | string,
    playerId: number | string
  ): Promise<Game | { error }> {
    try {
      const character = await CharacterService.factory.getRepository().findOne(characterId, { loadRelationIds: true })
      if (character) {
        const player = await PlayerService.factory.getRepository().findOne(playerId, { loadRelationIds: true })
        if (player && player.games.includes(character.game)) {
          return await this.factory.getRepository().findOne(character.game)
        } else {
          return { error: 'unauthorized' }
        }
      }
    } catch (err) {
      logger.error(`authorizePlayerCharacter: ${err}`)
      throw err
    }
  }
}
export default GameService
