import { DeepPartial } from 'typeorm'
import logger from '../../utils/logger'
import BattleFactory from '../factories/BattleFactory'
import Battle from '../models/Battle'
import CharacterService from './character'

export abstract class BattleService {
  static factory: BattleFactory = new BattleFactory()

  static async createBattle(
    gameId: number | string,
    playerId: number | string
  ): Promise<{ battleId: number | string }> {
    try {
      const character = await CharacterService.factory
        .getRepository()
        .findOne({ player: { id: playerId }, game: { id: gameId } })
      const battle = await this.factory.create({
        game: { id: gameId },
        initiator: character,
        participants: [character]
      })
      return { battleId: battle.id }
    } catch (err) {
      logger.error(`createBattle: ${err}`)
      throw err
    }
  }

  static async updateBattle(battleId: number | string, part: DeepPartial<Battle>): Promise<void> {
    try {
      await this.factory.getRepository().update(battleId, part)
    } catch (err) {
      logger.error(`updateBattle: ${err}`)
      throw err
    }
  }

  static async getBattle(battleId: number | string): Promise<Battle> {
    try {
      return await this.factory.getRepository().findOne(battleId)
    } catch (err) {
      logger.error(`getBattle: ${err}`)
      throw err
    }
  }

  static async deleteBattle(battleId: number | string): Promise<void> {
    try {
      await this.factory.getRepository().delete(battleId)
    } catch (err) {
      logger.error(`deleteBattle: ${err}`)
      throw err
    }
  }
}

export default BattleService
