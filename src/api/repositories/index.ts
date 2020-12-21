import UserRepository from './UserRepository'
import { getCustomRepository } from 'typeorm'
import conf from '../../config/index'

export class repos {
    userRepo = getCustomRepository(UserRepository,conf.env);
}

export default new repos();