import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import FailResponse from '../dto/response/FailResponse'
import MonsterRequest from '../dto/request/MonsterRequest'
import BattleService from '../services/battle'
import GameService from '../services/game'
import CreatureService from '../services/creature'
import BattleResponse from '../dto/response/BattleResponse'

/**
 * create a new battle
 * @description creates a new battle, adding the player's character associated with /games/{gameId} to the battle
 */
export async function createBattle(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    /* process the request and produce a response */
    const resp = await BattleService.createBattle(gameId, res.locals.auth.userId)
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const path = makeRoutePath('getBattle', { gameId, battleId: (resp as any).battleId })
    return respond.CREATED(res, path)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, new FailResponse({ error: err }))
  }
}

/**
 * retrieve a battle
 */
export async function getBattle(req: express.Request, res: express.Response): Promise<void> {
  const { gameId, battleId } = req.params
  try {
    /* process the request and produce a response */
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    return respond.OK(res, new BattleResponse(await BattleService.getBattle(battleId)))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * delete a battle
 */
export async function deleteBattle(req: express.Request, res: express.Response): Promise<void> {
  const { gameId, battleId } = req.params
  try {
    /* process the request and produce a response */
    const battle = await BattleService.authorizePlayerDelete(battleId, res.locals.auth.userId)
    if (!battle) {
      return respond.NOT_FOUND(res)
    }
    if ((battle as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await BattleService.deleteBattle(battleId)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * add enemy to battle
 * @description creates a new creatureInstance from the specified monsterId and adds it to the battle as an enemy
 */
export async function createEnemy(req: express.Request, res: express.Response): Promise<void> {
  const request = new MonsterRequest(req.body)
  const { gameId, battleId } = req.params
  try {
    /* process the request and produce a response */
    const battle = await BattleService.authorizeParticipant(battleId, res.locals.auth.userId)
    if (!battle) {
      return respond.NOT_FOUND(res)
    }
    if ((battle as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const creature = await CreatureService.generateCreature(request.monsterId)
    await BattleService.addEnemy(battleId, creature.id)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
