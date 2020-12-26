import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'

import config from '../../config'
import logger from '../../utils/logger'
import { UserFactory } from '../factories/UserFactory'
import UserRepository from '../repositories/UserRepository'

export type ErrorResponse = { error: { type: string, message: string } }
export type AuthResponse = ErrorResponse | { userId: string }
export type CreateUserResponse = ErrorResponse | { userId: string }
export type LoginUserResponse = ErrorResponse | { token: string, userId: string, expireAt: Date }

const privateKey = fs.readFileSync(config.privateKeyFile)
const privateSecret = {
    key: privateKey,
    passphrase: config.privateKeyPassphrase
}
const signOptions: SignOptions = {
    algorithm: 'RS256',
    expiresIn: '14d'
}
const publicKey = fs.readFileSync(config.publicKeyFile)
const verifyOptions: VerifyOptions = {
    algorithms: ['RS256']
}

const factory: UserFactory = new UserFactory()

function auth(bearerToken: string): Promise<AuthResponse> {
  return new Promise(function(resolve, reject) {
    const token = bearerToken.replace('Bearer ', '')
    jwt.verify(token, publicKey, verifyOptions, (err: VerifyErrors | null, decoded: object | undefined) => {
      if (err === null && decoded !== undefined) {
        const d = decoded as {userId?: string, exp: number}
        if (d.userId) {
          resolve({userId: d.userId})
          return
        }
      }
      resolve({error: {type: 'unauthorized', message: 'Authentication Failed'}})
    })
  })
}

async function createUser(email: string, password: string, name: string): Promise<CreateUserResponse> {
    try {
        const found = await factory.getRepository().findOne({email})
        if(found) return { error: { type: 'account_already_exists', message: `${email} already exists` } }

        const user = await factory.create({ email, name, password })
        if (user) {
            return { userId: user.id.toString() }
        }
    } catch (err) {
        logger.error(`createUser: ${err}`)
        throw err
    }
}

function createAuthToken(userId: number): Promise<{ token: string, expireAt: Date }> {
    return new Promise(function (resolve, reject) {
        jwt.sign({ userId: userId }, privateSecret, signOptions, (err: Error | null, encoded: string | undefined) => {
            if (err === null && encoded !== undefined) {
                const expireAfter = 14 * 24 * 60 * 60 // 14 days
                const expireAt = new Date()
                expireAt.setSeconds(expireAt.getSeconds() + expireAfter);
                resolve({ token: encoded, expireAt: expireAt })
            } else {
                reject(err)
            }
        })
    })
}

async function login(login: string, password: string): Promise<LoginUserResponse> {
    try {
        const repo = factory.getRepository() as UserRepository
        const user = await repo.findOne({ email: login })
        if (!user) {
            return { error: { type: 'invalid_credentials', message: 'Invalid Login/Password' } }
        }

        const passwordMatch = await repo.comparePassword(user.id, password)
        if (!passwordMatch) {
            return { error: { type: 'invalid_credentials', message: 'Invalid Login/Password' } }
        }

        const authToken = await createAuthToken(user.id)
        return { userId: user.id.toString(), token: authToken.token, expireAt: authToken.expireAt }
    } catch (err) {
        logger.error(`login: ${err}`)
        return Promise.reject({ error: { type: 'internal_server_error', message: 'Internal Server Error' } })
    }
}

export default { auth, createAuthToken, login, createUser }