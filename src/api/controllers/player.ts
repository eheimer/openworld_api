import * as express from 'express'
import { ErrorResponse } from 'types'
import * as respond from '../../utils/express'

import PlayerService from '../services/player'
import { writeJsonResponse } from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import { PublicPlayer } from '../factories/UserFactory'

export async function register(req: express.Request, res: express.Response): Promise<void> {
    const { email, password, name } = req.body

    try {
        let resp = await PlayerService.createPlayer(email, password, name)
        if ((resp as any).error) {
            if ((resp as ErrorResponse).error.type === 'account_already_exists') {
                writeJsonResponse(res, 409, resp)
            } else {
                throw new Error(`unsupported ${resp}`)
            }
        } else {
            let playerId = (resp as any).playerId
            let path = makeRoutePath('getPlayer', { playerId })
            return respond.CREATED(res, path)
        }
    } catch(err) {
        return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
}

export async function getPlayer(req: express.Request, res: express.Response): Promise<void> {
    const { playerId } = req.params
    let player
    if (playerId && res.locals.auth.userId) {
        try {
            player = await PlayerService.getPlayer(playerId)
            if (playerId !== res.locals.auth.userId) {
                player = new PublicPlayer(player)
            }
        } catch (err) {
            return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
        }
    }
    if (player) {
        return respond.OK(res,player)
    } else {
        return respond.NOT_FOUND(res)
    }
}