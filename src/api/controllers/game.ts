import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import GamesResponse from '../dto/response/GamesResponse'
import CreateGameRequest from '../dto/request/CreateGameRequest'
import GameResponse from '../dto/response/GameResponse'
import InvitePlayerRequest from '../dto/request/InvitePlayerRequest'
import GameService from '../services/game'
import PlayerService from '../services/player'
import Game from '../models/Game'
import User from '../models/User'
import BattleResponse from '../dto/response/BattleResponse'

/**
 * get player's /games
 * @description returns the games a player has access to
 */
export async function getGames(req: express.Request, res: express.Response): Promise<void> {
  const { playerId } = req.params
  try {
    const player = await PlayerService.getPlayer(playerId)
    if (!player) {
      return respond.NOT_FOUND(res)
    }
    const response: GamesResponse[] = await PlayerService.getGameCharacters(playerId)
    // 200: Success
    return respond.OK(res, response)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * create a new game
 */
export async function createGame(req: express.Request, res: express.Response): Promise<void> {
  const request = new CreateGameRequest(req.body)
  try {
    const resp = await GameService.createGame(request.name, request.maxPlayers, res.locals.auth.userId)
    // 201: Success Location Response
    const path = makeRoutePath('getGame', { gameId: (resp as any).gameId })
    return respond.CREATED(res, path)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * retrieve game
 */
export async function getGame(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    /* process the request and produce a response */
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    // 200: Success
    return respond.OK(res, new GameResponse(game))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * update game partial
 */
export async function updateGame(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await GameService.updateGame(gameId, req.body)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * remove a game
 * @description deletes the game, all battles, characters, creatureInstances, inventories, etc
 */
export async function deleteGame(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await GameService.deleteGame(gameId)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * add a player to a game
 * @description player id must exist at /players/{playerId}
 */
export async function joinGame(req: express.Request, res: express.Response): Promise<void> {
  const { gameId, playerId } = req.params
  try {
    const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await GameService.addPlayer(gameId, playerId)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * remove a player from a game
 * @description player id must exist at /players/{playerId}
 */
export async function leaveGame(req: express.Request, res: express.Response): Promise<void> {
  const { gameId, playerId } = req.params
  try {
    const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized' && playerId !== res.locals.auth.userId) {
      return respond.UNAUTHORIZED(res)
    }
    await GameService.removePlayer(gameId, playerId)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * invite a player to a game
 */
export async function invitePlayer(req: express.Request, res: express.Response): Promise<void> {
  const request = new InvitePlayerRequest(req.body)
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
    const player = await PlayerService.findPlayerWithEmail(request.email)
    if (!game || !player) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await GameService.addPlayer((game as Game).id, (player as User).id)
    // 201: Success Location Response
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * get battles
 */
export async function getGameBattles(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const battles = (await GameService.getBattles(gameId)).map((battle) => {
      return new BattleResponse(battle)
    })
    // 200: Success
    return respond.OK(res, battles)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
