import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import RegisterRequest from '../dto/request/RegisterRequest'
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
    const resp = await PlayerService.createPlayer(request.email, request.password, request.name)
    if ((resp as any).error) {
      if ((resp as ErrorResponse).error.type === 'account_already_exists') {
        return respond.CONFLICT(res, resp)
      } else {
        throw new Error(`unsupported ${resp}`)
      }
    }
    const path = makeRoutePath('getPlayer', { playerId: (resp as any).playerId })
    // 201: Success Location Response
    return respond.CREATED(res, path)
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
    const player = await PlayerService.getPlayer(playerId)
    if (!player) {
      return respond.NOT_FOUND(res)
    }
    const response = new PlayerResponse(player)
    // 200: Success
    return respond.OK(res, response)
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
    const player = await PlayerService.getPlayer(playerId)
    if (!player) {
      return respond.NOT_FOUND(res)
    }
    const response = new PlayerDetailResponse(player)
    // 200: Success
    return respond.OK(res, response)
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
    return respond.OK(res, response)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
