import faker from 'faker'

import { getConnection, getCustomRepository } from 'typeorm'

import UserRepository from '../../api/repositories/UserRepository'

const userRepo = getCustomRepository(UserRepository)

beforeAll(async () => {
    await getConnection().connect()
})

afterAll(async () => {
    await getConnection().close()
})

describe('save', () => {
    it('should create user', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()
        const before = Date.now()
        
        const user = await userRepo.create({ email: email, password: password, name: name})

        const after = Date.now()

        const fetched = await userRepo.findOne(user.id)

        expect(fetched).not.toBeNull()

        expect(fetched!.email).toBe(email)
        expect(fetched!.name).toBe(name)
        expect(fetched!.password).not.toBe(password)

        expect(before).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })

    it('should update user', async () => {
        const name1 = faker.name.firstName()
        const user = { email: faker.internet.email(), password: faker.internet.password(), name: name1 }
        const dbUser1 = await userRepo.create(user);

        const name2 = faker.name.firstName()
        dbUser1.name = name2
        await userRepo.update(dbUser1.id,dbUser1)
        const dbUser2 = await userRepo.findOne(dbUser1.id);

        await setTimeout(()=>{}, 1000);
        expect(dbUser2!.name).toEqual(name2)
    })

    it('should not save user with invalid email', async () => {
        const user1 = { email: 'email@em.o', password: faker.internet.password() }
        await expect(userRepo.create(user1)).rejects.toThrowError(/invalid email address/)
    })

    it('should not save user without an email', async () => {
        const user = { password: faker.internet.password(), name: faker.name.firstName() }
        await expect(userRepo.create()).rejects.toThrowError(/email/)
    })

    it('should not save user without a password', async () => {
        const user2 = { email: faker.internet.email(), name: faker.name.firstName() }
        await expect(userRepo.create()).rejects.toThrowError(/password/)
    })

    it('should not save user without a name', async () => {
        const user1 = { email: faker.internet.email(), password: faker.internet.password() }
        await expect(userRepo.create()).rejects.toThrowError(/name/)
    })

    it('should not save user with the same email', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()
        const userData = { email: email, password: password, name: name }

        const user1 = await userRepo.create(userData)

        await expect(userRepo.create(userData)).rejects.toThrowError(/E11000/)
    })

    it('should not save password in a readable form', async () => {
        const password = faker.internet.password()

        const user1 = await userRepo.create({ email: faker.internet.email(), password: password, name: faker.name.firstName() })
        expect(user1.password).not.toBe(password)

        const user2 = await userRepo.create({ email: faker.internet.email(), password: password, name: faker.name.firstName() })
        expect(user2.password).not.toBe(password)

        expect(user1.password).not.toBe(user2.password)
    })
})

describe('comparePassword', () => {
    it('should return true for valid password', async () => {
        const password = faker.internet.password()
        const user = await userRepo.create({ email: faker.internet.email(), password: password, name: faker.name.firstName() })
        expect(await userRepo.comparePassword(user.id, password)).toBe(true)
    })

    it('should return false for invalid password', async () => {
        const user = await userRepo.create({ email: faker.internet.email(), password: faker.internet.password(), name: faker.name.firstName() })
        expect(await userRepo.comparePassword(user.id, faker.internet.password())).toBe(false)
    })

    it('should update password hash if password is updated', async () => {
        const password1 = faker.internet.password()
        const dbUser1 = await userRepo.create({ email: faker.internet.email(), password: password1, name: faker.name.firstName() })
        expect(await userRepo.comparePassword(dbUser1.id,password1)).toBe(true)

        const password2 = faker.internet.password()
        dbUser1.password = password2
        const dbUser2 = await userRepo.save(dbUser1);
        expect(await userRepo.comparePassword(dbUser2.id, password2)).toBe(true)
        expect(await userRepo.comparePassword(dbUser2.id, password1)).toBe(false)
    })
})

describe('toJSON', () => {
    it('should return valid JSON', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()

        const user = await userRepo.create({ email: faker.internet.email(), password: faker.internet.password(), name: faker.name.firstName() })
        expect(user.serialize()).toEqual({ email: email, name: name, created: expect.any(Number) })
    })
})
