import faker from 'faker'

import user from '../../api/services/user'
import DB, { getRepos } from '../../utils/db'
import { UserFactory } from '../../api/factories/UserFactory'

const factory = new UserFactory()

beforeAll(async () => {
  await DB.init()
})

afterAll(async () => {
})

describe('login', () => {
  it('should return JWT token, userId, expireAt to a valid login/password', async () => {
    const dummy = factory.makeDummy()
    const dummydb = await factory.create(dummy)
    await expect(user.login(dummy.email, dummy.password)).resolves.toEqual({
      userId: dummydb.id,
      token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
      expireAt: expect.any(Date)
    })
  })

  it('should reject with error if login does not exist', async () => {
    await expect(user.login(faker.internet.email(), faker.internet.password())).resolves.toEqual({
      error: {type: 'invalid_credentials', message: 'Invalid Login/Password'}
    })
  })

  it('should reject with error if password is wrong', async () => {
    const dummy = factory.makeDummy()
    const dummydb = await factory.create(dummy)
    await expect(user.login(dummy.email, faker.internet.password())).resolves.toEqual({
      error: {type: 'invalid_credentials', message: 'Invalid Login/Password'}
    })
  })
})

describe('auth', () => {
  it('should resolve with true and valid userId for hardcoded token', async () => {
    const dummy = await factory.createDummy()
    const authToken = await user.createAuthToken(dummy.id)
    await expect(user.auth(authToken.token)).resolves.toEqual({userId: dummy.id})
  })

  it('should resolve with false for invalid token', async () => {
    const response = await user.auth('invalidToken')
    expect(response).toEqual({error: {type: 'unauthorized', message: 'Authentication Failed'}})
  })

  it('auth perfromance test', async () => {
    const dummy = await factory.createDummy()
    const authToken = await user.createAuthToken(dummy.id)

    const now = new Date().getTime()
    let i = 0
    do {
      i += 1
      await user.auth(`Bearer ${authToken.token!}`)
    } while (new Date().getTime() - now < 1000)
    
    console.log(`auth perfromance test: ${i}`)
  })
})

describe('createUser', () => {
    it('should resolve with true and valid userId', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()

        await expect(user.createUser(email, password, name)).resolves.toEqual({
            userId: expect.stringMatching(/^[a-f0-9\-]{36}$/)
        })
    })

    it('should resolve with false & valid error if duplicate', async () => {
        const email = faker.internet.email()
        const password = faker.internet.password()
        const name = faker.name.firstName()

        await user.createUser(email, password, name)

      await expect(user.createUser(email, password, name)).resolves.toEqual({
            error: {
                type: 'account_already_exists',
                message: `${email} already exists`
            }
      })
    })

    it('should reject if invalid input', async () => {
        const email = 'invalid@em.c'
        const password = faker.internet.password()
        const name = faker.name.firstName()

      await expect(user.createUser(email, password, name)).rejects.toThrowError(/Validation failed!/)
    })
})