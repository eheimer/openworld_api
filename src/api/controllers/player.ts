import * as express from 'express'
import { CreatePlayerResponse, ErrorResponse } from 'types'
import * as respond from '../../utils/express'

import PlayerService from '../services/player'
import { writeJsonResponse } from '../../utils/express'
import logger from '../../utils/logger'
import { makeRoutePath, routes } from '../../utils/server'

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
            respond.CREATED(res, path)
        }
    } catch(err) {
        logger.error(`register: ${err}`)
        respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
}

export async function getPlayer(req: express.Request, res: express.Response): Promise<void> {
}