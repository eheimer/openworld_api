import UserRepository from './UserRepository'
import { getCustomRepository, getRepository, Repository } from 'typeorm'

export class RepoContainer {
    User: UserRepository;

    constructor(connection: string) {
        this.User=getCustomRepository(UserRepository,connection);
    }
}

export default RepoContainer;