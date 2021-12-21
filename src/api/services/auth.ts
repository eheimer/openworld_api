/**
 *  services/auth.ts
 *    Authentication Service
 */

import fs from 'fs'
import jwt, { SignOptions, VerifyErrors, VerifyOptions } from 'jsonwebtoken'
import { AuthResponse, LoginResponse } from 'types'

import config from '../../config'
import logger from '../../utils/logger'
import { UserFactory } from '../factories/UserFactory'
import UserRepository from '../repositories/UserRepository'

const privateKey = fs.readFileSync(config.privateKeyFile)
const privateSecret = {
  key: privateKey,
  passphrase: config.privateKeyPassphrase
}
const signOptions: SignOptions = {
  algorithm: 'RS256',
  expiresIn: '24h'
}
const publicKey = fs.readFileSync(config.publicKeyFile)
const verifyOptions: VerifyOptions = {
  algorithms: ['RS256']
}

const factory: UserFactory = new UserFactory()

function auth(bearerToken: string): Promise<AuthResponse> {
  return new Promise(function (resolve, reject) {
    const token = bearerToken.replace('Bearer ', '')
    jwt.verify(token, publicKey, verifyOptions, (err: VerifyErrors | null, decoded: object | undefined) => {
      if (err === null && decoded !== undefined) {
        const d = decoded as { userId?: string; exp: number }
        if (d.userId) {
          resolve({ playerId: d.userId })
          return
        }
      }
      resolve({
        error: { type: 'unauthorized', message: 'Authentication Failed' }
      })
    })
  })
}

function createAuthToken(userId: number | string): Promise<{ token: string; expireAt: Date }> {
  return new Promise(function (resolve, reject) {
    jwt.sign({ userId: userId }, privateSecret, signOptions, (err: Error | null, encoded: string | undefined) => {
      if (err === null && encoded !== undefined) {
        const expireAfter = 24 * 60 * 60 // 24 hours
        const expireAt = new Date()
        expireAt.setSeconds(expireAt.getSeconds() + expireAfter)
        resolve({ token: encoded, expireAt: expireAt })
      } else {
        reject(err)
      }
    })
  })
}

async function login(login: string, password: string): Promise<LoginResponse> {
  try {
    const repo = factory.getRepository() as UserRepository
    const user = await repo.findOne({ email: login })
    if (!user) {
      return {
        error: {
          type: 'invalid_credentials',
          message: 'Invalid Login/Password'
        }
      }
    }

    const passwordMatch = await repo.comparePassword(user.id, password)
    if (!passwordMatch) {
      return {
        error: {
          type: 'invalid_credentials',
          message: 'Invalid Login/Password'
        }
      }
    }

    const authToken = await createAuthToken(user.id)
    return { player: user.id, token: authToken.token }
  } catch (err) {
    logger.error(`login: ${err}`)
    return Promise.reject({
      error: { type: 'internal_server_error', message: 'Internal Server Error' }
    })
  }
}

export default { auth, createAuthToken, login }
