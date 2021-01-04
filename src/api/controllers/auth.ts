import * as express from 'express'
import logger from '../../utils/logger'
import AuthService from '../../api/services/auth'
import * as respond from '../../utils/express'
import { UserFactory } from '../factories/UserFactory'
import { ErrorResponse } from 'types'

export async function auth(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
    const token = req.headers.authorization!
    try {
        let authResponse = await AuthService.auth(token)
        if (!(authResponse as any).error) {
            //is this necessary?  I don't think I need it
            res.locals.auth = {
                userId: (authResponse as { playerId: string }).playerId
            }
            next()
        } else {
            respond.UNAUTHORIZED(res, (authResponse as any).error!.message)
        }
    } catch (err) {
        respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    } 
}

export async function login(req: express.Request, res: express.Response): Promise<void> {
    const {email, password} = req.body
    try {
        let resp = await AuthService.login(email, password)
  
        if ((resp as any).error) {
            if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
                respond.NOT_FOUND(res, resp)
            } else {
                throw new Error(`unsupported ${resp}`)
            }
        } else {
            const { player, token } = resp as { token: string, player: string }
            respond.OK(res, { player, token })
        }
    } catch (err) {
      logger.error(`login: ${err}`)
      respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
}
