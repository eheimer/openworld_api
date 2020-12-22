import UserRepository from './UserRepository'
import { getCustomRepository, Repository } from 'typeorm'
import User from '../models/User'

export class RepoContainer {
    userRepo: UserRepository;
    //otherRepo: Repository<Model>;

    constructor(connection: string) {
        this.userRepo=getCustomRepository(UserRepository,connection);
        //this.otherRepo = getRepository(Model, connection);
    }
}

export default RepoContainer;