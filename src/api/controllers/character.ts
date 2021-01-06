import * as express from 'express'
import * as respond from '../../utils/express'

import CharacterService from '../services/character'
import { makeRoutePath } from '../../utils/server'
import { PublicCharacter } from '../factories/CharacterFactory'

export async function createCharacter(req: express.Request, res: express.Response): Promise<void> {
    const { gameId } = req.params
    const { name, maxHp, baseResist, inventorySize } = req.body
    if (res.locals.auth.userId) {
        try {
            let resp = await CharacterService.createCharacter(name, maxHp, baseResist, inventorySize, res.locals.auth.userId, gameId)
            let path = makeRoutePath('getCharacter', { gameId, characterId: (resp as any).characterId })
            return respond.CREATED(res,path)
        } catch (err) {
            return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
        }
    }
}

export async function getCharacter(req: express.Request, res: express.Response): Promise<void> {
    const { characterId } = req.params
    let character
    if (characterId && res.locals.auth.userId) {
        try {
            character = await CharacterService.getCharacter(characterId)
            if (character.player !== res.locals.auth.userId) {
                character = new PublicCharacter(character)
            }
        } catch (err) {
            return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
        }
    }
    if (character) {
        return respond.OK(res,character)
    } else {
        return respond.NOT_FOUND(res)
    }
}

export async function updateCharacter(req: express.Request, res: express.Response): Promise<void> {
    const { characterId } = req.params
    try {
        const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
        if (!character) {
            return respond.NOT_FOUND(res)
        }
        if ((character as { error }).error === 'unauthorized') {
            return respond.UNAUTHORIZED(res)
        }
        await CharacterService.updateCharacter(characterId, req.body)
        return respond.NO_CONTENT(res)
    } catch (err) {
        return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
}

export async function deleteCharacter(req: express.Request, res: express.Response): Promise<void> {
    const { characterId } = req.params
    try {
        const character = await CharacterService.authorizePlayer(characterId, res.locals.auth.userId)
        if (!character) {
            return respond.NOT_FOUND(res)
        }
        if ((character as { error }).error === 'unauthorized') {
            return respond.UNAUTHORIZED(res)
        }
        await CharacterService.deleteCharacter(characterId)
        return respond.NO_CONTENT(res)
    } catch (err) {
        return respond.INTERNAL_SERVER_ERROR(res, 'Internal Server Error')
    }
}