import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'

import config from '../../config'
import logger from '../../utils/logger'

import { getCustomRepository } from 'typeorm'

import UserRepository from '../repositories/UserRepository'

const userRepo = getCustomRepository(UserRepository)

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
        const user = await userRepo.create({ email: email, password: password, name: name })
        if (user) {
            return { userId: user.id.toString() }
        } else {
            return { error: { type: 'account_already_exists', message: `${email} already exists` } }
        }
    } catch (err) {
        logger.error(`createUser: ${err}`)
        return err
    }
}

function createAuthToken(userId: string): Promise<{ token: string, expireAt: Date }> {
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
        const user = await userRepo.findOne({ email: login })
        if (!user) {
            return { error: { type: 'invalid_credentials', message: 'Invalid Login/Password' } }
        }

        const passwordMatch = await userRepo.comparePassword(user.id, password)
        if (!passwordMatch) {
            return { error: { type: 'invalid_credentials', message: 'Invalid Login/Password' } }
        }

        const authToken = await createAuthToken(user.id.toString())
        return { userId: user.id.toString(), token: authToken.token, expireAt: authToken.expireAt }
    } catch (err) {
        logger.error(`login: ${err}`)
        return Promise.reject({ error: { type: 'internal_server_error', message: 'Internal Server Error' } })
    }
}

export default { auth, createAuthToken, login, createUser }