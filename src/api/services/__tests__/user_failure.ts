import jwt, {Secret, SignCallback, SignOptions} from 'jsonwebtoken'

import {createDummy} from '../../../tests/user'
import user from '../user'

import { getConnection, getCustomRepository } from 'typeorm'

import UserRepository from '../../repositories/UserRepository'

const userRepo = getCustomRepository(UserRepository)

beforeAll(async () => {
    await getConnection().connect()
})

afterAll(async () => {
    await getConnection().close()
})

describe('login', () => {
  it('should return internal_server_error if jwt.sign fails with the error', async () => {
    (jwt.sign as any) = (payload: string | Buffer | object,
      secretOrPrivateKey: Secret,
      options: SignOptions,
      callback: SignCallback) => {
        callback(new Error('failure'), undefined)
    }

    const dummy = await createDummy()
    await expect(user.login(dummy.email, dummy.password)).rejects.toEqual({
      error: {type: 'internal_server_error', message: 'Internal Server Error'}
    })
  })
})
