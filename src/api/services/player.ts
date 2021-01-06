import { CreatePlayerResponse } from "../../../types"
import logger from "../../utils/logger"
import { UserFactory, PublicPlayer } from "../factories/UserFactory"
import User from "../models/User"

const factory: UserFactory = new UserFactory()

async function createPlayer(email: string, password: string, name: string): Promise<CreatePlayerResponse> {
    try {
        const found = await factory.getRepository().findOne({email})
        if(found) return { error: { type: 'account_already_exists', message: `${email} already exists` } }

        const user = await factory.create({ email, name, password })
        if (user) {
            return { playerId: user.id.toString() }
        }
    } catch (err) {
        logger.error(`createPlayer: ${err}`)
        throw err
    }
}

async function updatePlayerLastSeen(playerId: string, when?: Date): Promise<void> {
    if (!when) {
        when = new Date(Date.now())
    }
    try {
        await factory.getRepository().update(playerId, { lastSeenAt: when })
    } catch (err) {
        logger.error(`updatePlayerLastSeen: ${err}`)
        throw err
    }
}

async function getPlayer(playerId: string): Promise<User> {
    try {
        return await factory.getRepository().findOne(playerId)
    } catch (err) {
        logger.error(`getPlayer: ${err}`)
        throw err
    }
}

async function getPlayerWithRelations(playerId: string): Promise<User> {
    try {
        return await factory.getRepository().findOne(playerId, { loadRelationIds: true })
    } catch (err) {
        logger.error(`getPlayerWithRelations: ${err}`)
        throw err
    }
}

async function getPublicPlayer(playerId: string): Promise<PublicPlayer> {
    try {
        return new PublicPlayer(await factory.getRepository().findOne(playerId))
    } catch (err) {
        logger.error(`getPublicPlayer: ${err}`)
        throw err
    }
}

export default { createPlayer, updatePlayerLastSeen, getPlayer, getPlayerWithRelations, getPublicPlayer }