import * as express from 'express'
import AuthService from '../services/auth'
import * as respond from '../../utils/express'
import CharacterService from '../services/character'

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
    //get characterId from req
    let characterId = req.params.characterId
    if (!characterId) {
      characterId = req.body.characterId
    }
    if (!characterId) {
      return respond.NOT_FOUND(res, 'Authorizing character, no characterId found in reqeust')
    }
    const character = await CharacterService.authorizePlayer(characterId, playerId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res, 'Character operation not available to requestor')
    }
    // attach character to the response for use in controllers
    res.locals.character = character
    next()
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

export async function playerGameOwner(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
): Promise<void> {
  next()
}
