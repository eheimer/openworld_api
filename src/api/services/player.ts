import { CreatePlayerResponse } from '../../../types'
import logger from '../../utils/logger'
import GameCharacter from '../dto/GameCharacter'
import CharacterFactory from '../factories/CharacterFactory'
import UserFactory from '../factories/UserFactory'
import Game from '../models/Game'
import User from '../models/User'

const factory: UserFactory = new UserFactory()
const charFactory: CharacterFactory = new CharacterFactory()

async function createPlayer(email: string, password: string, name: string): Promise<CreatePlayerResponse> {
  try {
    const found = await factory.getRepository().findOne({ email })
    if (found)
      return {
        error: {
          type: 'account_already_exists',
          message: `${email} already exists`
        }
      }

    const user = await factory.create({ email, name, password })
    if (user) {
      return { playerId: user.id }
    }
  } catch (err) {
    logger.error(`createPlayer: ${err}`)
    throw err
  }
}

async function updatePlayerLastSeen(playerId: number | string, when?: Date): Promise<void> {
  if (!when) {
    when = new Date(Date.now())
  }
  try {
    await factory.getRepository().update(playerId, { lastSeenAt: when })
  } catch (err) {
    logger.error(`updatePlayerLastSeen: ${err}`)
    throw err
  }
}

async function getPlayer(playerId: number | string): Promise<User> {
  try {
    return await factory.getRepository().findOne(playerId)
  } catch (err) {
    logger.error(`getPlayer: ${err}`)
    throw err
  }
}

async function findPlayerWithEmail(email: string): Promise<User> {
  try {
    return await factory.getRepository().findOne({ email: email })
  } catch (err) {
    logger.error(`findPlayerWithEmail: ${err}`)
    throw err
  }
}

async function getPlayerWithGames(playerId: number | string): Promise<User> {
  try {
    return await factory.getRepository().findOne(playerId, { relations: ['games', 'games.owner'] })
  } catch (err) {
    logger.error(`getPlayerWithGames: ${err}`)
    throw err
  }
}

async function getGameCharacters(playerId: number | string): Promise<GameCharacter[]> {
  try {
    const games: Game[] = (await getPlayerWithGames(playerId)).games
    const gameChars: GameCharacter[] = []
    for (const game of games) {
      const char = await charFactory.getRepository().findOne({ player: { id: playerId }, game: game })
      gameChars.push(new GameCharacter({ game, char, owner: game.owner.id === playerId }))
    }
    return gameChars
  } catch (err) {
    logger.error(`getGameCharacters: ${err}`)
    throw err
  }
}

async function getPlayerWithRelations(playerId: number | string): Promise<User> {
  try {
    return await factory.getRepository().findOne(playerId, { loadRelationIds: true })
  } catch (err) {
    logger.error(`getPlayerWithRelations: ${err}`)
    throw err
  }
}

export default {
  createPlayer,
  updatePlayerLastSeen,
  getPlayer,
  findPlayerWithEmail,
  getPlayerWithGames,
  getPlayerWithRelations,
  getGameCharacters
}
