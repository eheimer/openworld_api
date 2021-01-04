import { CreatePlayerResponse } from "../../../types"
import logger from "../../utils/logger"
import { UserFactory } from "../factories/UserFactory"

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
        logger.error(`createUser: ${err}`)
        throw err
    }
}

async function updatePlayerLastSeen(playerId: string, when?: Date): Promise<void> {
    if (!when) {
        when = new Date(Date.now())
    }
    await factory.getRepository().update(playerId, { lastSeenAt: when})
}

export default { createPlayer, updatePlayerLastSeen }