import faker from 'faker'

import User from '@openworld/api/models/user'
import UserService from '@openworld/api/services/user'

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
    const dbUser = new User(user)
    await dbUser.save()
    return { ...user, userId: dbUser._id.toString() }
}

export async function createDummyAndAuthorize(): Promise<AuthorizedDummyUser> {
    const user = await createDummy()
    const authToken = await UserService.createAuthToken(user.userId)
    return { ...user, token: authToken.token }
}
