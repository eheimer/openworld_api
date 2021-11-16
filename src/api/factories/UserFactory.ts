import User from '../models/User'
import defaultFaker from 'faker'
import { EntityFactory } from './EntityFactory'
import { DeepPartial } from 'typeorm'
import UserRepository from '../repositories/UserRepository'

export class PublicPlayer {
    id: number | string; name: string; lastSeenAt: Date
    constructor(player: User) {
        this.id = player.id
        this.name = player.name
        this.lastSeenAt = player.lastSeenAt
    }
}

export class UserFactory extends EntityFactory<User>{
    constructor(){super(User)}
    protected async postCreate(entity: User, data: DeepPartial<User>) {
        if (data.password) {
            const repo: UserRepository = this.getRepository() as UserRepository
            entity.password = repo.generatePasswordHash(data.password)
        }
    }
    makeDummy(faker?: Faker.FakerStatic): User {
        if (!faker) faker = defaultFaker;
        const u = new User()
        u.name = faker.name.firstName()
        u.email = faker.internet.email()
        u.password = faker.internet.password()
        u.isAdmin = faker.datatype.boolean()
        u.lastSeenAt = faker.date.recent(7)
        return u
    }
}

