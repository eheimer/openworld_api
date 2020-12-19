import faker from 'faker'

import UserService from '../api/services/user'

import UserRepository from '../api/repositories/UserRepository'
import { getCustomRepository } from 'typeorm'

const userRepo = getCustomRepository(UserRepository)

type DummyUser = { email: string, password: string, name: string, userId: string }
type AuthorizedDummyUser = { email: string, password: string, name: string, userId: string, token: string }

export function dummy() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName()
    }
}

export async function createDummy(): Promise<DummyUser> {
    const user = dummy()
    const dbUser = await userRepo.create(user)
    return { ...user, userId: dbUser.id.toString() }
}

export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
    const user = await createDummy()
    const authToken = await UserService.createAuthToken(user.userId)
    return { ...user, token: authToken.token }
}
