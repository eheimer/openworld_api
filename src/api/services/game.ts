import { DeepPartial } from 'typeorm'
import logger from '../../utils/logger'
import { GameCharacter } from '../dto/GameCharacter'
import { BattleFactory } from '../factories/BattleFactory'
import { CharacterFactory, PublicCharacter } from '../factories/CharacterFactory'
import { GameFactory} from '../factories/GameFactory'
import { UserFactory} from '../factories/UserFactory'
import { Battle } from '../models/Battle'
import Game from '../models/Game'

const factory: GameFactory = new GameFactory()

async function createGame(name: string, maxPlayers: number, owner: number | string): Promise<{gameId: number | string}> {
  try {
    let player = await new UserFactory().getRepository().findOne(owner)
    let game = await factory.create({name,maxPlayers,owner: player, players: [player]})
    return { gameId: game.id }
  } catch (err) {
    logger.error(`createGame: ${err}`)
    throw err
  }
}

async function updateGame(gameId: number | string, part: DeepPartial<Game>): Promise<void> {
  try {
    await factory.getRepository().update(gameId, part)
  } catch (err) {
    logger.error(`updateGame: ${err}`)
    throw err
  }
}

async function getGame(gameId: number | string): Promise<Game> {
  try {
    return await factory.getRepository().findOne(gameId)
  } catch (err) {
    logger.error(`getGame: ${err}`)
    throw err
  }
}

async function getGameWithRelations(gameId: number | string): Promise<Game> {
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

async function addPlayer(gameId: number | string, playerId: number | string): Promise<void> {
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

async function removePlayer(gameId: number | string, playerId: number | string): Promise<void> {
  try {
    const game = await factory.getRepository().findOne(gameId, { relations: ['players'] })
    if (game) {
      let filtered = game.players.filter(item => { return item.id.toString() != playerId.toString() })
      game.players = filtered;
      await factory.getRepository().save(game)
    }
  } catch (err) {
    logger.error(`addPlayer: ${err}`)
    throw err
  }
}

async function getCharacters(gameId: number | string): Promise<PublicCharacter[]> {
  const characters = await new CharacterFactory().getRepository().find({ game: { id: gameId } })
  const pub: PublicCharacter[] = []
  for (let character of characters) {
    pub[pub.length] = new PublicCharacter(character)
  }
  return pub
}

async function getBattles(gameId: number | string): Promise<Battle[]> {
  console.log({gameId, num: gameId})
  const battles = await new BattleFactory().getRepository().find({game: {id: gameId}})
  console.log({battles})
  return battles
}

/**
 * Validates that playerId is the game owner
 */
async function authorizeOwner(gameId: number | string, playerId: number | string): Promise<Game | {error}> {
  try {
    const game = await factory.getRepository().findOne(gameId, { loadRelationIds: true})
    if (!game) {
      return
    }
    if (game.owner.toString() === playerId.toString()) {
      return game
    } else {
      return { error: 'unauthorized'}
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
async function authorizeMember(gameId: number | string, playerId: number | string): Promise<Game | { error }>{
  try {
    let game = await authorizeOwner(gameId,playerId)
    if (!game || (game as { error }).error) {
      game = await factory.getRepository().findOne(gameId, {loadRelationIds: true})
    }
    if (!game) {
      return
    }
    console.log({ contains: ((game as Game).players as any).includes(playerId)})
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
async function authorizePlayerCharacter(characterId: number | string, playerId: number | string): Promise<Game | { error }> {
  try {
    const character = await new CharacterFactory().getRepository().findOne(characterId, {loadRelationIds: true})
    if (character) {
      const player = await new UserFactory().getRepository().findOne(playerId, {loadRelationIds: true})
      if (player && player.games.includes(character.game)) {
        return await factory.getRepository().findOne(character.game)
      } else {
        return { error: 'unauthorized' }
      }
    }
  } catch (err) {
    logger.error(`authorizePlayerCharacter: ${err}`)
    throw err
  }
}

export default { getGame, getGameWithRelations, updateGame, createGame, deleteGame, addPlayer, removePlayer, authorizeOwner, authorizeMember, authorizePlayerCharacter, getCharacters, getBattles }