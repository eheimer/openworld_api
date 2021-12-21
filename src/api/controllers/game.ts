import * as express from 'express'
import * as respond from '../../utils/express'

import GameService from '../services/game'
import PlayerService from '../services/player'
import { makeRoutePath } from '../../utils/server'
import Game from '../models/Game'
import User from '../models/User'
import { GameCharacter } from '../dto/GameCharacter'

export async function getGame(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    return respond.OK(res, game)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

export async function getGames(req: express.Request, res: express.Response): Promise<void> {
  const { playerId } = req.params
  try {
    const player = await PlayerService.getPlayer(playerId)
    if (!player) {
      return respond.NOT_FOUND(res)
    }
    const gameChars: GameCharacter[] = await PlayerService.getGameCharacters(playerId)
    return respond.OK(res, gameChars)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

export async function createGame(req: express.Request, res: express.Response): Promise<void> {
  const { name, maxPlayers } = req.body
  if (res.locals.auth.userId) {
    try {
      const resp = await GameService.createGame(name, maxPlayers, res.locals.auth.userId)
      const path = makeRoutePath('getGame', { gameId: (resp as any).gameId })
      return respond.CREATED(res, path)
    } catch (err) {
      return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
  }
}

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
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

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
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

export async function invitePlayer(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  const { email } = req.body
  try {
    const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
    const player = await PlayerService.findPlayerWithEmail(email)
    if (!game || !player) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await GameService.addPlayer((game as Game).id, (player as User).id)
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

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
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

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
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

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
    return respond.OK(res, await GameService.getCharacters(gameId))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

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
    return respond.OK(res, await GameService.getBattles(gameId))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
