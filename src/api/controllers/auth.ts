import * as express from 'express'
import AuthService from '../services/auth'
import * as respond from '../../utils/express'
import AuthorizationService from '../services/authorization'

/**
 * Security controller - attach playerId to the response to make further authorization tests possible
 * attaches res.locals.auth
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
      //since this may have been called from another auth method, next might be null
      if (next) next()
    } else {
      return respond.UNAUTHORIZED(res, (authResponse as any).error!.message)
    }
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * Route authorization controller - ensure player is owner of the requested character
 * attaches res.locals.character
 */
export async function playerCharacterOwner(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  /*
   NOTE: this seems a bit of a hack, but because of how swagger works, only one
        defined security method needs to succeed.  Thus, these authorizations
        methods will be the SOLE security method for the route, and therefore
        need to validate the authentication themselves.  We do this by calling
        the auth() method here without a next() callback, and verifying that we
        now have res.locals.auth.
  */
  await auth(req, res, null)
  const playerId = res.locals.auth.userId
  try {
    const characterId = getParamFromRequest('characterId', req)

    if (!characterId) {
      return respond.NOT_FOUND(res, 'Authorizing character, no characterId found in reqeust')
    }

    const character = await AuthorizationService.authorizePlayerCharacterOwner(characterId, playerId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error: string }).error == 'unauthorized') {
      return respond.UNAUTHORIZED(res, 'Character operation not available to requestor')
    }
    // attach character to the response for use in controllers
    res.locals.character = character
    next()
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * Route authorization controller - ensure player is owner of the requested game
 * attaches res.locals.game
 */
export async function playerGameOwner(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  await auth(req, res, null)
  const playerId = res.locals.auth.userId
  try {
    const gameId = getParamFromRequest('gameId', req)

    if (!gameId) {
      return respond.NOT_FOUND(res, 'Authorizing game, no gameId found in request')
    }

    const game = await AuthorizationService.authorizeGameOwner(gameId, playerId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }

    if ((game as { error: string }).error == 'unauthorized') {
      return respond.UNAUTHORIZED(res, 'Game operation not available to requestor')
    }
    // attach game to the response for use in controllers
    res.locals.game = game
    next()
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * Route authorization controller - ensure player is member of the requested game
 * attaches res.locals.game
 */
export async function playerGameMember(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  await auth(req, res, null)
  const playerId = res.locals.auth.userId
  try {
    const gameId = getParamFromRequest('gameId', req)

    if (!gameId) {
      return respond.NOT_FOUND(res, 'Authorizing game, no gameId found in request')
    }

    const game = await AuthorizationService.authorizeGameOwner(gameId, playerId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }

    if ((game as { error: string }).error == 'unauthorized') {
      return respond.UNAUTHORIZED(res, 'Game operation not available to requestor')
    }
    // attach game to the response for use in controllers
    res.locals.game = game
    next()
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * Route authorization controller - ensure player and character are in same game
 * attaches res.locals.character
 */
export async function playerGameCharacter(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  await auth(req, res, null)
  const playerId = res.locals.auth.userId
  try {
    const characterId = getParamFromRequest('characterId', req)

    if (!characterId) {
      return respond.NOT_FOUND(res, 'Authorizing character, no characterId found in request')
    }

    const character = await AuthorizationService.authorizePlayerGameCharacter(characterId, playerId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }

    if ((character as { error: string }).error == 'unauthorized') {
      return respond.UNAUTHORIZED(res, 'Character operation not available to requestor')
    }
    // attach character to the response for use in controllers
    res.locals.character = character
    next()
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * Route authorization controller - ensure player is authorized to remove requested battle
 * attaches res.locals.battle
 */
export async function battleDiscard(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  await auth(req, res, null)
  const playerId = res.locals.auth.userId
  try {
    const battleId = getParamFromRequest('battleId', req)

    if (!battleId) {
      return respond.NOT_FOUND(res, 'Authorizing battle participant, no battleId found in request')
    }

    const battle = await AuthorizationService.authorizeBattleDelete(battleId, playerId)
    if (!battle) {
      return respond.NOT_FOUND(res)
    }

    if ((battle as { error: string }).error == 'unauthorized') {
      return respond.UNAUTHORIZED(res, 'Battle operation not available to requestor')
    }
    // attach battle to the response for use in controllers
    res.locals.battle = battle
    next()
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * Route authorization controller - ensure player is participant of requested battle
 * attaches res.locals.battle
 */
export async function playerBattleParticipant(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  await auth(req, res, null)
  const playerId = res.locals.auth.userId
  try {
    const battleId = getParamFromRequest('battleId', req)

    if (!battleId) {
      return respond.NOT_FOUND(res, 'Authorizing battle participant, no battleId found in request')
    }

    const battle = await AuthorizationService.authorizeBattleParticipant(battleId, playerId)
    if (!battle) {
      return respond.NOT_FOUND(res)
    }

    if ((battle as { error: string }).error == 'unauthorized') {
      return respond.UNAUTHORIZED(res, 'Battle operation not available to requestor')
    }
    // attach battle to the response for use in controllers
    res.locals.battle = battle
    next()
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

function getParamFromRequest(param: string, req: express.Request): any {
  let value = req.params[param]
  if (!value) {
    value = req.body[param]
  }
  return value
}
