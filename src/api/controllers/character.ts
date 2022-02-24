import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import CreateCharacterRequest from '../dto/request/CreateCharacterRequest'
import FailResponse from '../dto/response/FailResponse'
import CharacterResponse from '../dto/response/CharacterResponse'
import UpdateCharacterRequest from '../dto/request/UpdateCharacterRequest'
import CharacterDetailResponse from '../dto/response/CharacterDetailResponse'
import GameService from '../services/game'
import User from '../models/User'
import CharacterService from '../services/character'
import Game from '../models/Game'
import PublicCharacter from '../dto/PublicCharacter'

/**
 * create character
 */
export async function createCharacter(req: express.Request, res: express.Response): Promise<void> {
  const request = new CreateCharacterRequest(req.body)
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const resp = await CharacterService.createCharacter(
      request.name,
      request.maxHp,
      request.baseResist,
      request.inventorySize,
      res.locals.auth.userId,
      gameId
    )
    // 201: Success Location Response
    const path = makeRoutePath('getCharacter', { gameId, characterId: (resp as any).characterId })
    return respond.CREATED(res, path)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * get all characters for game
 */
export async function getGameCharacters(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    // 200: Success
    return respond.OK(res, (game as Game).characters)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * retrieve character
 * @description retrieves either the public character or detail, depending on the player making the request
 */
export async function getCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that player and character are both in same game
    const game = await GameService.authorizePlayerCharacter(characterId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const character = await CharacterService.getCharacter(characterId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    // 200: Success
    return respond.OK(res, new CharacterResponse(character))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * update character partial
 */
export async function updateCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await CharacterService.updateCharacter(characterId, req.body)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * remove a character
 * @description deletes the character and its inventory
 */
export async function deleteCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await CharacterService.deleteCharacter(characterId)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * retrieve character
 * @description retrieves either the public character or detail, depending on the player making the request
 */
export async function getCharacterDetail(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    // 200: Success
    return respond.OK(res, new CharacterDetailResponse(character))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
