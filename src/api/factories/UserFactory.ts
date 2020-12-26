import User from '../models/User'
import defaultFaker from 'faker'
import { EntityFactory } from './EntityFactory'
import { DeepPartial } from 'typeorm'

export class UserFactory extends EntityFactory<User>{
    constructor(){super(User)}
    protected async postCreate(entity: User, data: DeepPartial<User>) {
        if (data.password) {
            entity.updatePasswordHash()
        }
    }
    makeDummy(faker?: Faker.FakerStatic): User {
        if (!faker) faker = defaultFaker;
        const u = new User()
        u.name = faker.name.firstName()
        u.email = faker.internet.email()
        u.password = faker.internet.password()
        u.isAdmin = faker.random.boolean()
        u.lastSeenAt = faker.date.recent(7)
        return u
    }
}

