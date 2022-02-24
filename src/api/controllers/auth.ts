import * as express from 'express'
import AuthService from '../services/auth'
import PlayerService from '../services/player'
import * as respond from '../../utils/express'
import { ErrorResponse } from '../../../types'
import LoginResponse from '../dto/response/LoginResponse'

/**
 * Security controller - attach playerId to the response to make further authorization tests possible
 *
 * @param req
 * @param res
 * @param next
 */
export async function auth(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> {
  const token = req.headers.authorization!
  try {
    const authResponse = await AuthService.auth(token)
    if (!(authResponse as any).error) {
      res.locals.auth = {
        userId: (authResponse as { playerId: number | string }).playerId
      }
      next()
    } else {
      respond.UNAUTHORIZED(res, (authResponse as any).error!.message)
    }
  } catch (err) {
    respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
