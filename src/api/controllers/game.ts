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