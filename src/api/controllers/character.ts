import * as express from 'express'
import * as respond from '../../utils/express'
import { makeRoutePath } from '../../utils/server'
import CreateCharacterRequest from '../dto/request/CreateCharacterRequest'
import CharacterResponse from '../dto/response/CharacterResponse'
import GameService from '../services/game'
import CharacterService from '../services/character'
import Game from '../models/Game'
import Character from '../models/Character'
import InventoryFactory from '../factories/InventoryFactory'
import InventoryResponse from '../dto/response/InventoryResponse'
import UpdateCharacterSkillRequest from '../dto/request/UpdateCharacterSkillRequest'
import CharacterSkill from '../models/CharacterSkill'
import CharacterSkillDTO from '../dto/CharacterSkill'
import { getRepo } from '../../utils/db'
import CharacterSkillFactory from '../factories/CharacterSkillFactory'

/**
 * create character
 */
export async function createCharacter(req: express.Request, res: express.Response): Promise<void> {
  const request = new CreateCharacterRequest(req.body)
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const resp = await CharacterService.createCharacter(
      request.name,
      request.strength,
      request.dexterity,
      request.intelligence,
      request.movement,
      res.locals.auth.userId,
      gameId
    )
    // 201: Success Location Response
    const path = makeRoutePath('getCharacter', { gameId, characterId: (resp as any).characterId })
    return respond.CREATED(res, path)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * get all characters for game
 */
export async function getGameCharacters(req: express.Request, res: express.Response): Promise<void> {
  const { gameId } = req.params
  try {
    const game = await GameService.authorizeMember(gameId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    // 200: Success
    return respond.OK(res, (game as Game).characters)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * retrieve character
 * @description retrieves either the public character or detail, depending on the player making the request
 */
export async function getCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that player and character are both in same game
    const game = await GameService.authorizePlayerCharacter(characterId, res.locals.auth.userId)
    if (!game) {
      return respond.NOT_FOUND(res)
    }
    if ((game as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const character = await CharacterService.getCharacter(characterId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    // 200: Success
    return respond.OK(res, new CharacterResponse(character))
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * update character partial
 */
export async function updateCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await CharacterService.updateCharacter(characterId, req.body)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * remove a character
 * @description deletes the character and its inventory
 */
export async function deleteCharacter(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await CharacterService.deleteCharacter(characterId)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * retrieve character
 * @description retrieves either the public character or detail, depending on the player making the request
 */
export async function getCharacterDetail(req: express.Request, res: express.Response): Promise<void> {
  const { characterId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    // 200: Success
    const response = CharacterService.buildCharacterDetail(character as Character)
    if (character as Character) {
      //populate inventory
      const inventory = new InventoryResponse(
        await new InventoryFactory().getRepository().findOne((character as Character).inventory)
      )
      response.inventory = inventory
      //populate skills
      response.skills = []
      const csRepo = new CharacterSkillFactory().getRepository()
      const skills = await csRepo.findByIds((character as Character).skills, { relations: ['skill'] })
      for (const a of skills) {
        response.skills.push(
          new CharacterSkillDTO({
            id: a.id,
            name: a.skill.name,
            description: a.skill.description,
            level: a.level
          })
        )
      }
    }
    //TODO: populate conditions
    return respond.OK(res, response)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * add a skill to a given character
 * @description creates a new skill at level 1 and adds it to the character
 */
export async function addCharacterSkill(req: express.Request, res: express.Response): Promise<void> {
  const { characterId, skillId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    await CharacterService.addCharacterSkill(characterId, skillId, 1)
    // 204: Success, no content
    return respond.NO_CONTENT(res)
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * update the skill level
 */
export async function updateCharacterSkill(req: express.Request, res: express.Response): Promise<void> {
  const request = new UpdateCharacterSkillRequest(req.body)
  const { characterId, skillId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const repo = getRepo('CharacterSkill', CharacterSkill)
    const cSkill = await repo.findOne(skillId, { loadRelationIds: true })
    if (cSkill && (cSkill.character as unknown as string) === characterId) {
      cSkill.level = request.level > 4 ? 1 : request.level
      await repo.save(cSkill)
      return respond.NO_CONTENT(res)
    } else {
      return respond.NOT_FOUND(res, 'bad skill id')
    }
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}

/**
 * remove a skill from a character
 */
export async function deleteCharacterSkill(req: express.Request, res: express.Response): Promise<void> {
  const { characterId, skillId } = req.params
  try {
    //verify that character belongs to player
    const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
    if (!character) {
      return respond.NOT_FOUND(res)
    }
    if ((character as { error }).error === 'unauthorized') {
      return respond.UNAUTHORIZED(res)
    }
    const repo = getRepo('CharacterSkill', CharacterSkill)
    const cSkill = await repo.findOne(skillId, { loadRelationIds: true })
    if (cSkill && (cSkill.character as unknown as string) === characterId) {
      await repo.delete(skillId)
      // 204: Success, no content
      return respond.NO_CONTENT(res)
    } else {
      return respond.NOT_FOUND(res, 'bad skill id')
    }
  } catch (err) {
    return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
  }
}
