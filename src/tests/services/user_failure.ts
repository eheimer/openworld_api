import jwt, {Secret, SignCallback, SignOptions} from 'jsonwebtoken'

import {createDummy} from '../helpers/user'
import user from '../../api/services/user'

import DB, { getRepos } from '../../utils/db'

beforeAll(async () => {
    await DB.init()
})

afterAll(async () => {
    //await DB.getInstance().close()
})

describe('login', () => {
  it('should return internal_server_error if jwt.sign fails with the error', async () => {
    (jwt.sign as any) = (payload: string | Buffer | object,
      secretOrPrivateKey: Secret,
      options: SignOptions,
      callback: SignCallback) => {
        callback(new Error('failure'), undefined)
    }

    const dummy = await createDummy(getRepos().userRepo)
    await expect(user.login(dummy.email, dummy.password)).rejects.toEqual({
      error: {type: 'internal_server_error', message: 'Internal Server Error'}
    })
  })
})
