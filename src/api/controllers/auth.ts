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

export async function login(req: express.Request, res: express.Response): Promise<void> {
  const { email, password } = req.body
  try {
    const resp = await AuthService.login(email, password)

    if ((resp as any).error) {
      if ((resp as ErrorResponse).error.type === 'invalid_credentials') {
        respond.NOT_FOUND(res, resp)
      } else {
        throw new Error(`unsupported ${resp}`)
      }
    } else {
      const response = new LoginResponse(resp)
      await PlayerService.updatePlayerLastSeen(response.player)
      respond.OK(res, response)
    }
  } catch (err) {
    respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
