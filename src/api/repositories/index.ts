import UserRepository from './UserRepository'
import { getCustomRepository, getRepository, Repository } from 'typeorm'
import { ActiveCondition } from '../models/ActiveCondition'

export class RepoContainer {
    User: UserRepository;

    constructor(connection: string) {
        this.User=getCustomRepository(UserRepository,connection);
    }
}

export default RepoContainer;