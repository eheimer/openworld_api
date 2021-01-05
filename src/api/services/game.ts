import logger from '../../utils/logger'
import { GameFactory} from '../factories/GameFactory'
import { UserFactory} from '../factories/UserFactory'
import Game from '../models/Game'

const factory: GameFactory = new GameFactory()

async function createGame(name: string, maxPlayers: number, owner: string): Promise<{gameId: number}> {
  try {
    let player = await new UserFactory().getRepository().findOne(owner)
    let game = await factory.create({name,maxPlayers,owner: player, players: [player]})
    return { gameId: game.id }
  } catch (err) {
    logger.error(`createGame: ${err}`)
    throw err
  }
}

async function updateGame(): Promise<void> {
  try {
    throw('Not Implemented')
  } catch (err) {
    logger.error(`updateGame: ${err}`)
    throw err
  }
}

async function getGame(gameId: string): Promise<Game> {
  try {
    return await factory.getRepository().findOne(gameId)
  } catch (err) {
    logger.error(`getGame: ${err}`)
    throw err
  }
}

async function deleteGame(): Promise<void> {
  try {
    throw('Not Implemented')
  } catch (err) {
    logger.error(`deleteGame: ${err}`)
    throw err
  }
}

export default { getGame, updateGame, createGame, deleteGame }