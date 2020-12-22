import faker, { date } from 'faker'

import DB, {getRepos, getRepo} from '../../utils/db'

import UserRepository from '../../api/repositories/UserRepository'
import User from '../../api/models/User'

let userRepo: UserRepository;

beforeAll(async () => {
    await DB.init();
    userRepo = getRepos().userRepo;
})

describe('save', () => {
    it('should create user', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()
        const before = Date.now()
        const user = userRepo.create({ email: email, name: name})
        user.password = password;
        await userRepo.save(user);

        const after = Date.now()

        console.log({before, save: user.createdAt.getTime(), after})

        const fetched = await userRepo.findOne(user.id) as User

        expect(fetched).not.toBeNull()

        expect(fetched!.email).toBe(email)
        expect(fetched!.name).toBe(name)
        expect(fetched!.password).not.toBe(password)

        //TODO: these fail because mysql is truncating milliseconds in its dates
        expect(before).toBeLessThanOrEqual(fetched!.createdAt.getTime())
        expect(fetched!.createdAt.getTime()).toBeLessThanOrEqual(after)
    })

    it('should update user', async () => {
        const name1 = faker.name.firstName()
        const user = userRepo.create({ email: faker.internet.email(), name: name1 })
        user.password = faker.internet.password()
        const dbUser1 = await userRepo.save(user);

        const name2 = faker.name.firstName()
        dbUser1.name = name2
        await userRepo.update(dbUser1.id,dbUser1)
        const dbUser2 = await userRepo.findOne(dbUser1.id);

        expect(dbUser2!.name).toEqual(name2)
    })

    //TODO: need a validator for this one
    it('should not save user with invalid email', async () => {
        const user1 = { email: 'email@em.o', password: faker.internet.password() }
        await expect(userRepo.save(user1)).rejects.toThrowError(/invalid email address/)
    })

    it('should not save user without an email', async () => {
        const user = userRepo.create({ name: faker.name.firstName() })
        user.password = faker.internet.password()

        await expect(userRepo.save(user)).rejects.toThrowError(/email/)
    })

    it('should not save user without a password', async () => {
        const user2 = { email: faker.internet.email(), name: faker.name.firstName() }
        await expect(userRepo.save(user2)).rejects.toThrowError(/password/)
    })

    it('should not save user without a name', async () => {
        const user1 = userRepo.create({ email: faker.internet.email()})
        user1.password = faker.internet.password()
        await expect(userRepo.save(user1)).rejects.toThrowError(/name/)
    })

    it('should not save user with the same email', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()
        const userData = {email: email, name: name}

        const user1 = userRepo.create(userData)
        user1.password = password
        await userRepo.save(user1)

        const user2 = userRepo.create(userData)
        user2.password = password

        await expect(userRepo.save(user2)).rejects.toThrowError(/UNIQUE constraint/)
    })

    it('should not save password in a readable form', async () => {
        const password = faker.internet.password()

        const user1 = userRepo.create({ email: faker.internet.email(), name: faker.name.firstName() })
        user1.password = password
        await userRepo.save(user1)
        expect(user1.password).not.toBe(password)

        const user2 = userRepo.create({ email: faker.internet.email(), name: faker.name.firstName() })
        user2.password = password
        await userRepo.save(user2)
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
