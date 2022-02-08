import { DeepPartial } from 'typeorm'
import logger from '../../utils/logger'
import BattleFactory from '../factories/BattleFactory'
import CharacterFactory from '../factories/CharacterFactory'
import Battle from '../models/Battle'

const factory: BattleFactory = new BattleFactory()

async function createBattle(
  gameId: number | string,
  playerId: number | string
): Promise<{ battleId: number | string }> {
  try {
    const character = await new CharacterFactory()
      .getRepository()
      .findOne({ player: { id: playerId }, game: { id: gameId } })
    const battle = await factory.create({
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

async function updateBattle(battleId: number | string, part: DeepPartial<Battle>): Promise<void> {
  try {
    await factory.getRepository().update(battleId, part)
  } catch (err) {
    logger.error(`updateBattle: ${err}`)
    throw err
  }
}

async function getBattle(battleId: number | string): Promise<Battle> {
  try {
    return await factory.getRepository().findOne(battleId)
  } catch (err) {
    logger.error(`getBattle: ${err}`)
    throw err
  }
}

async function deleteBattle(battleId: number | string): Promise<void> {
  try {
    await factory.getRepository().delete(battleId)
  } catch (err) {
    logger.error(`deleteBattle: ${err}`)
    throw err
  }
}

export default { getBattle, createBattle, updateBattle, deleteBattle }
