import faker, { date } from 'faker'

import DB from '../../utils/db'

import UserRepository from '../../api/repositories/UserRepository'
import User from '../../api/models/User'
import { UserFactory } from '../../api/factories/UserFactory'

const factory = new UserFactory()
let userRepo: UserRepository

beforeAll(async () => {
    await DB.init();
    userRepo = factory.getRepository() as UserRepository
})

describe('save', () => {
    it('should create user', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()
        const before = Date.now()
        const dbuser = await factory.create({email,password,name})

        const after = Date.now()

        const fetched = await userRepo.findOne(dbuser.id) as User

        expect(fetched).not.toBeNull()

        expect(fetched!.email).toBe(email)
        expect(fetched!.name).toBe(name)
        expect(fetched!.password).not.toBe(password)
        expect(fetched!.isAdmin).toBe(false)

        expect(before-1000).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })

    it('should update user', async () => {
        const user = await factory.createDummy();
        const newname = faker.name.firstName()
        user.name = newname
        await userRepo.update(user.id,user)
        const user2 = await userRepo.findOne(user.id);

        expect(user2!.name).toEqual(newname)
    })

    it('should not save user with invalid email', async () => {
        const user = factory.makeDummy()
        user.email = 'email@em.o' //invalid email address
        await expect(factory.create(user)).rejects.toThrowError(/Validation failed!/)
    })

    it('should not save user without an email', async () => {
        const user = factory.makeDummy()
        delete user.email
        await expect(factory.create(user)).rejects.toThrowError(/Validation failed!/)
    })

    it('should not save user without a password', async () => {
        const user = factory.makeDummy()
        user.password = null
        await expect(factory.create(user)).rejects.toThrowError(/password/)
    })

    it('should not save user without a name', async () => {
        const user = factory.makeDummy()
        delete user.name
        await expect(factory.create(user)).rejects.toThrowError(/name/)
    })

    it('should not save user with the same email', async () => {
        const user1 = await factory.createDummy()
        const user2 = factory.makeDummy()
        user2.email = user1.email
        await expect(factory.create(user2)).rejects.toThrowError(/UNIQUE constraint/)
    })

    it('should not save password in a readable form', async () => {
        const user1 = factory.makeDummy()
        let dbuser1 = await factory.create(user1)
        expect(dbuser1.password).not.toBe(user1.password)

        const user2 = factory.makeDummy()
        let dbuser2 = await factory.create(user2)
        expect(dbuser2.password).not.toBe(user2.password)

        expect(dbuser1.password).not.toBe(dbuser2.password)
    })
})

describe('comparePassword', () => {
    it('should return true for valid password', async () => {
        const user = factory.makeDummy()
        let dbuser = await factory.create(user)
        expect(await userRepo.comparePassword(dbuser.id, user.password)).toBe(true)
    })

    it('should return false for invalid password', async () => {
        const user = await factory.createDummy()
        expect(await userRepo.comparePassword(user.id, faker.internet.password())).toBe(false)
    })

    it('should update password hash if password is updated', async () => {
        const user1 = factory.makeDummy()
        let dbuser1 = await factory.create(user1)
        expect(await userRepo.comparePassword(dbuser1.id,user1.password)).toBe(true)

        const password2 = faker.internet.password()
        dbuser1.updatePasswordHash(password2)
        const dbUser2 = await userRepo.save(dbuser1);
        expect(await userRepo.comparePassword(dbUser2.id, password2)).toBe(true)
        expect(await userRepo.comparePassword(dbUser2.id, user1.password)).toBe(false)
    })
})

describe('toJSON', () => {
    it('should return valid JSON', async () => {
        const user = await factory.createDummy()

        let json = JSON.stringify(user);
        let obj = JSON.parse(json);
        expect(Date.parse(obj.createdAt)).toBe<Number>(user.createdAt.getTime())
        expect(Date.parse(obj.updatedAt)).toBe<Number>(user.updatedAt.getTime())
        expect(obj).toMatchObject({email:user.email, name:user.name})
    })
})
