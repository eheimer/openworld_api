import * as express from 'express'
import * as respond from '../../utils/express'

import CharacterService from '../services/character'
import GameService from '../services/game'
import { makeRoutePath } from '../../utils/server'
import PublicCharacter from '../dto/PublicCharacter'
import CreateCharacterRequest from '../dto/request/CreateCharacterRequest'

/**
 * Creates a new character for the requesting player in a game
 */
export async function createCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  // verify that the requesting player is a member of the game
  const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
  if (!game) {
    return respond.NOT_FOUND(res)
  }
  if ((game as { error }).error === 'unauthorized') {
    return respond.UNAUTHORIZED(res)
  }
  try {
    const request = new CreateCharacterRequest(req.body)
    const resp = await CharacterService.createCharacter(
      request.name,
      request.maxHp,
      request.baseResist,
      request.inventorySize,
      res.locals.auth.userId,
      gameId
    )
    const path = makeRoutePath('getCharacter', {
      gameId,
      characterId: (resp as any).characterId
    })
    return respond.CREATED(res, path)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

export async function getCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  //verify that player and character are both in same game
  const game = await GameService.authorizePlayerCharacter(characterId, res.locals.auth.userId)
  if (!game) {
    return respond.NOT_FOUND(res)
  }
  if ((game as { error }).error === 'unauthorized') {
    return respond.UNAUTHORIZED(res)
  }
  let character
  if (characterId && res.locals.auth.userId) {
    try {
      character = await CharacterService.getCharacter(characterId)
      if (character.player !== res.locals.auth.userId) {
        character = new PublicCharacter(character)
      }
    } catch (err) {
      return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
  }
  if (character) {
    return respond.OK(res, character)
  } else {
    return respond.NOT_FOUND(res)
  }
}

export async function updateCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await CharacterService.updateCharacter(characterId, req.body)
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

export async function deleteCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await CharacterService.deleteCharacter(characterId)
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
