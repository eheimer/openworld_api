import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import RegisterRequest from '../dto/request/RegisterRequest'
import FailResponse from '../dto/response/FailResponse'
import PlayerResponse from '../dto/response/PlayerResponse'
import PlayerDetailResponse from '../dto/response/PlayerDetailResponse'
import LoginRequest from '../dto/request/LoginRequest'
import LoginResponse from '../dto/response/LoginResponse'
import AuthService from '../services/auth'
import { ErrorResponse } from '../../../types/index'
import PlayerService from '../services/player'

/**
 * register new player
 */
export async function register(req: express.Request, res: express.Response): Promise<void> {
  const request = new RegisterRequest(req.body)
  try {
    /* process the request and produce a response */
    // handle the following responses:
    // 201: Success Location Response
    const path = ''
    // generate the location path, for example:
    // const path = makeRoutePath('getGame', { gameId: (resp as any).gameId })
    return respond.CREATED(res, path)
    // 404: Resource not found
    // return respond.NOT_FOUND(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * retrieve a player
 * @description returns public info for player
 */
export async function getPlayer(req: express.Request, res: express.Response): Promise<void> {
  const { playerId } = req.params
  try {
    /* process the request and produce a response */
    const response = new PlayerResponse({})
    // handle the following responses:
    // 200: Success
    return respond.OK(res, PlayerResponse)
    // 404: Resource not found
    // return respond.NOT_FOUND(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * retrieve player details
 * @description returns more details if the requester is the player being requested
 */
export async function getPlayerDetail(req: express.Request, res: express.Response): Promise<void> {
  const { playerId } = req.params
  try {
    /* process the request and produce a response */
    const response = new PlayerDetailResponse({})
    // handle the following responses:
    // 200: Success
    return respond.OK(res, PlayerDetailResponse)
    // 404: Resource not found
    // return respond.NOT_FOUND(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * login
 * @description login the player to the specified game, initiate a socket if successful
 */
export async function login(req: express.Request, res: express.Response): Promise<void> {
  const request = new LoginRequest(req.body)
  try {
    /* process the request and produce a response */
    const response = await AuthService.login(request.email, request.password)

    if ((response as any).error) {
      if ((response as ErrorResponse).error.type === 'invalid_credentials') {
        return respond.NOT_FOUND(res, response)
      } else {
        throw new Error(`unsupported ${response}`)
      }
    }

    await PlayerService.updatePlayerLastSeen((response as LoginResponse).player)
    // 200: Success
    return respond.OK(res, LoginResponse)
    // 404: Resource not found
    // return respond.NOT_FOUND(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
