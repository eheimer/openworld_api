import * as express from 'express'
import * as respond from '../../utils/express'

import GameService from '../services/game'
import { makeRoutePath } from '../../utils/server'

export async function getGame(req: express.Request, res: express.Response): Promise<void> {
    const { gameId } = req.params
    let game
    if (gameId) {
        try {
            game = await GameService.getGame(gameId)
        } catch(err) {
            respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
        }
    }
    if (game) {
        respond.OK(res,game)
    } else {
        respond.NOT_FOUND(res)
    }
}

export async function createGame(req: express.Request, res: express.Response): Promise<void> {
    const { name, maxPlayers } = req.body
    if (res.locals.auth.userId) {
        try {
            let resp = await GameService.createGame(name,maxPlayers,res.locals.auth.userId)
            let path = makeRoutePath('getGame', { gameId: (resp as any).gameId })
            respond.CREATED(res,path)
        } catch (err) {
            respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
        }
    }
}

export async function updateGame(req: express.Request, res: express.Response): Promise<void> {
    const { gameId } = req.params
    try {
        const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
        if (!game) {
            respond.NOT_FOUND(res)
        }
        if ((game as {error}).error === 'unauthorized') {
            respond.UNAUTHORIZED(res)
        }
        await GameService.updateGame(gameId, req.body)
        respond.NO_CONTENT(res)
    } catch (err) {
        respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
}

export async function deleteGame(req: express.Request, res: express.Response): Promise<void> {
    const { gameId } = req.params
    try {
        const game = await GameService.authorizeOwner(gameId, res.locals.auth.userId)
        if (!game) {
            respond.NOT_FOUND(res)
        }
        if ((game as { error }).error === 'unauthorized') {
            respond.UNAUTHORIZED(res)
        }
        await GameService.deleteGame(gameId)
        respond.NO_CONTENT(res)
    } catch (err) {
        respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
}