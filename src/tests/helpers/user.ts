import faker from 'faker'

import UserService from '../../api/services/user'

import UserRepository from '../../api/repositories/UserRepository'

type DummyUser = { email: string, password: string, name: string, userId: string }
type AuthorizedDummyUser = { email: string, password: string, name: string, userId: string, token: string }

export function dummy() {
    return {
        email: faker.internet.email(),
        password: faker.internet.password(),
        name: faker.name.firstName()
    }
}

export async function createDummy(userRepo: UserRepository): Promise<DummyUser> {
    const user = dummy()
    const dbUser = await userRepo.create(user)
    return { ...user, userId: dbUser.id.toString() }
}

export async function createDummyAndAuthorize(userRepo: UserRepository): Promise<AuthorizedDummyUser> {
    const user = await createDummy(userRepo)
    const authToken = await UserService.createAuthToken(user.userId)
    return { ...user, token: authToken.token }
}
