import { CreatePlayerResponse } from "../../../types"
import logger from "../../utils/logger"
import { GameCharacter } from "../dto/GameCharacter"
import { UserFactory, PublicPlayer } from "../factories/UserFactory"
import Game from "../models/Game"
import User from "../models/User"
import { CharacterFactory } from "../factories/CharacterFactory"

const factory: UserFactory = new UserFactory()
const charFactory: CharacterFactory = new CharacterFactory()

async function createPlayer(email: string, password: string, name: string): Promise<CreatePlayerResponse> {
    try {
        const found = await factory.getRepository().findOne({email})
        if(found) return { error: { type: 'account_already_exists', message: `${email} already exists` } }

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

async function getPlayerWithGames(playerId: number | string): Promise<User>{
    try {
        return await factory.getRepository().findOne(playerId, { relations: ['games']})
    } catch (err) {
        logger.error(`getPlayerWithGames: ${err}`)
        throw err
    }
}

async function getGameCharacters(playerId: number | string): Promise<GameCharacter[]> {
  try {
    const games: Game[] = (await getPlayerWithGames(playerId)).games
    const gameChars: GameCharacter[] = []
    for (let game of games) {
        const char = await charFactory.getRepository().findOne({ player: { id: playerId }, game: game })
        gameChars.push(new GameCharacter(game, char))
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

export default { createPlayer, updatePlayerLastSeen, getPlayer, getPlayerWithGames, getPlayerWithRelations, getGameCharacters }