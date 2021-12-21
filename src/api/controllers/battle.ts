import * as express from 'express';
import * as respond from '../../utils/express';

import BattleService from '../services/battle';
import GameService from '../services/game';
import { makeRoutePath } from '../../utils/server';

export async function createBattle(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { gameId } = req.params;
  try {
    const resp = await BattleService.createBattle(
      gameId as unknown as number,
      res.locals.auth.userId
    );
    const path = makeRoutePath('getBattle', {
      gameId,
      battleId: (resp as any).battleId
    });
    return respond.CREATED(res, path);
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error');
  }
}

export async function getBattle(
  req: express.Request,
  res: express.Response
): Promise<void> {
  const { gameId, battleId } = req.params;
  try {
    const game = await GameService.authorizeMember(
      gameId,
      res.locals.auth.userId
    );
    if (!game) {
      return respond.NOT_FOUND(res);
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res);
    }
    return respond.OK(res, await BattleService.getBattle(battleId));
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error');
  }
}
