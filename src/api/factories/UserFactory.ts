import User from '../models/User'
import defaultFaker from 'faker'
import { EntityFactory } from './EntityFactory'
import { DeepPartial, Repository } from 'typeorm'

export class UserFactory extends EntityFactory<User>{
    protected async postCreate(entity: User, data: DeepPartial<User>, repo: Repository<User>) {
        entity.password = data.password
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

