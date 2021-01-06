import * as express from 'express'
import * as respond from '../../utils/express'

import GameService from '../services/game'
import { makeRoutePath } from '../../utils/server'

export async function getGame(req: express.Request, res: express.Response): Promise<void> {
    const { gameId } = req.params
    let game
    if (gameId) {
        try {
            game = await GameService.getGameWithRelations(gameId)
        } catch(err) {
            return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
        }
    }
    if (game) {
        return respond.OK(res,game)
    } else {
        return respond.NOT_FOUND(res)
    }
}

export async function createGame(req: express.Request, res: express.Response): Promise<void> {
    const { name, maxPlayers } = req.body
    if (res.locals.auth.userId) {
        try {
            let resp = await GameService.createGame(name,maxPlayers,res.locals.auth.userId)
            let path = makeRoutePath('getGame', { gameId: (resp as any).gameId })
            return respond.CREATED(res,path)
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
        if ((game as {error}).error === 'unauthorized') {
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
        if (!game ) {
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