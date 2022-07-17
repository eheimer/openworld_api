import Character from '../models/Character'
import CharacterFactory from '../factories/CharacterFactory'
import logger from '../../utils/logger'
import Battle from '../models/Battle'
import BattleFactory from '../factories/BattleFactory'
import CharacterService from './character'
import GameFactory from '../factories/GameFactory'
import Game from '../models/Game'
import PlayerService from './player'

export abstract class AuthorizationService {
  /**
   * Validate that player owns the character
   *
   * @param {string} characterId
   * @param {string} playerId
   * @returns {Character} the character
   */
  static async authorizePlayerCharacterOwner(
    characterId: number | string,
    playerId: number | string
  ): Promise<Character | { error }> {
    try {
      const character = await new CharacterFactory().getRepository().findOne(characterId, {
        loadRelationIds: true,
        relations: ['inventory', 'pets', 'skills', 'conditions', 'race', 'race.skills', 'battles']
      })
      if (!character) {
        return
      }
      if (character.player.toString() === playerId.toString()) {
        return character
      } else {
        return { error: 'unauthorized' }
      }
    } catch (err) {
      logger.error(`authorizePlayerCharacter: ${err}`)
      throw err
    }
  }

  /**
   * Validates that playerId is a participant in the battle
   *
   * @param {string} battleId
   * @param {string} playerId
   * @returns {Battle} the battle
   */
  static async authorizeBattleParticipant(
    battleId: number | string,
    playerId: number | string
  ): Promise<Battle | { error }> {
    try {
      const battle = await new BattleFactory().getRepository().findOne(battleId, { loadRelationIds: true })
      if (!battle) {
        return
      }
      const participants = (battle as Battle).participants as any[]
      const character = await CharacterService.getGameCharacter((battle as Battle).game as any, playerId)
      if (!character) {
        return
      }
      if (participants.includes(character.id)) {
        return battle
      } else {
        return { error: 'unauthorized' }
      }
    } catch (err) {
      logger.error(`authorizeBattleParticipant: ${err}`)
      throw err
    }
  }

  /**
   * Validates that playerId is able to delete the battle
   *
   * @param {string} battleId
   * @param {string} playerId
   * @returns {Battle} the battle
   */
  static async authorizeBattleDelete(
    battleId: number | string,
    playerId: number | string
  ): Promise<Battle | { error }> {
    try {
      const battle = await new BattleFactory().getRepository().findOne(battleId, { loadRelationIds: true })
      if (!battle) {
        return
      }
      const initiator = (battle as Battle).initiator as any
      const participants = (battle as Battle).participants as any[]
      const character = await CharacterService.getGameCharacter((battle as Battle).game as any, playerId)
      if (!character) {
        return
      }

      if (
        initiator == character.id ||
        participants.length == 0 ||
        (participants.length == 1 && participants.includes(character.id))
      ) {
        return battle
      } else {
        return { error: 'unauthorized' }
      }
    } catch (err) {
      logger.error(`authorizeBattleDelete: ${err}`)
      throw err
    }
  }

  /**
   * Validates that playerId is the game owner
   *
   * @param {string} gameId
   * @param {string} playerId
   * @returns {Game} the game
   */
  static async authorizeGameOwner(gameId: number | string, playerId: number | string): Promise<Game | { error }> {
    try {
      const game = await new GameFactory().getRepository().findOne(gameId, { loadRelationIds: true })
      if (!game) {
        return
      }
      if (game.owner.toString() === playerId.toString()) {
        return game
      } else {
        return { error: 'unauthorized' }
      }
    } catch (err) {
      logger.error(`authorizeGameOwner: ${err}`)
      throw err
    }
  }

  /**
   * Validates that playerId is a member of the game
   *
   * @param {string} gameId
   * @param {string} playerId
   * @returns {Game} the game
   */
  static async authorizeGameMember(gameId: number | string, playerId: number | string): Promise<Game | { error }> {
    try {
      let game = await this.authorizeGameOwner(gameId, playerId)
      if (!game || (game as { error }).error) {
        game = await new GameFactory().getRepository().findOne(gameId, { loadRelationIds: true })
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
      logger.error(`authorizeGameMember: ${err}`)
      throw err
    }
  }

  /**
   * Validates that playerId and characterId are in the same game
   *
   * @param {string} playerId
   * @param {string} characterId
   * @returns {Game} the game
   */
  static async authorizePlayerGameCharacter(
    characterId: number | string,
    playerId: number | string
  ): Promise<Character | { error }> {
    try {
      const character = await CharacterService.factory.getRepository().findOne(characterId, { loadRelationIds: true })
      if (character) {
        const player = await PlayerService.factory.getRepository().findOne(playerId, { loadRelationIds: true })
        if (player && player.games.includes(character.game)) {
          return character
        } else {
          return { error: 'unauthorized' }
        }
      }
    } catch (err) {
      logger.error(`authorizePlayerGameCharacter: ${err}`)
      throw err
    }
  }
}

export default AuthorizationService
