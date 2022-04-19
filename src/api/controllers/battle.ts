import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import FailResponse from '../dto/response/FailResponse'
import MonsterRequest from '../dto/request/MonsterRequest'
import BattleService from '../services/battle'
import CreatureService from '../services/creature'
import BattleResponse from '../dto/response/BattleResponse'

/**
 * create a new battle
 * @description creates a new battle, adding the player's character associated with /games/{gameId} to the battle
 */
export async function createBattle(req: express.Request, res: express.Response): Promise<void> {
  try {
    const game = res.locals.game
    const resp = await BattleService.createBattle(game.id, res.locals.auth.userId)
    const path = makeRoutePath('getBattle', { gameId: game.id, battleId: (resp as any).battleId })
    return respond.CREATED(res, path)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, new FailResponse({ error: err }))
  }
}

/**
 * retrieve a battle
 */
export async function getBattle(req: express.Request, res: express.Response): Promise<void> {
  try {
    const { battleId } = req.params
    return respond.OK(res, new BattleResponse(await BattleService.getBattle(battleId)))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * delete a battle
 */
export async function deleteBattle(req: express.Request, res: express.Response): Promise<void> {
  try {
    const battle = res.locals.battle
    await BattleService.deleteBattle(battle.id)
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
  try {
    const request = new MonsterRequest(req.body)
    const battle = res.locals.battle
    const creature = await CreatureService.generateCreature(request.monsterId)
    await BattleService.addEnemy(battle.id, creature.id)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
