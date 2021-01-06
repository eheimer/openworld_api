import { DeepPartial } from 'typeorm'
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

async function updateGame(gameId: string, part: DeepPartial<Game>): Promise<void> {
  try {
    await factory.getRepository().update(gameId, part)
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

async function getGameWithRelations(gameId: string): Promise<Game> {
  try {
    return await factory.getRepository().findOne(gameId,{ loadRelationIds: true})
  } catch (err) {
    logger.error(`getGameWithRelations: ${err}`)
    throw err
  }
}

async function deleteGame(gameId: string): Promise<void> {
  try {
    await factory.getRepository().delete(gameId)
  } catch (err) {
    logger.error(`deleteGame: ${err}`)
    throw err
  }
}

async function addPlayer(gameId: string, playerId: string): Promise<void> {
  try {
    const game = await factory.getRepository().findOne(gameId, { relations: ['players'] })
    const player = await new UserFactory().getRepository().findOne(playerId)
    if (game && player && !game.players.includes(player)) {
      game.players[game.players.length] = player
      await factory.getRepository().save(game)
    }
  } catch (err) {
    logger.error(`addPlayer: ${err}`)
    throw err
  }

}

async function removePlayer(gameId: string, playerId: string): Promise<void> {
  try {
    const game = await factory.getRepository().findOne(gameId, { relations: ['players'] })
    if (game) {
      let filtered = game.players.filter(item => { return item.id.toString() != playerId })
      console.log({ players: game.players, filtered })
      game.players = filtered;
      await factory.getRepository().save(game)
    }
  } catch (err) {
    logger.error(`addPlayer: ${err}`)
    throw err
  }
}

/**
 * returns game if playerid is the game owner
 */
async function authorizeOwner(gameId: string, playerId: string): Promise<Game | {error}> {
  try {
    const game = await factory.getRepository().findOne(gameId, { loadRelationIds: true})
    if (!game) {
      return
    }
    if (game.owner.toString() === playerId) {
      return game
    } else {
      return { error: 'unauthorized'}
    }
  } catch (err) {
    logger.error(`authorizeOwner: ${err}`)
    throw err
  }
}

export default { getGame, getGameWithRelations, updateGame, createGame, deleteGame, addPlayer, removePlayer, authorizeOwner }