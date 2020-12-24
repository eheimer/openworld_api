import UserRepository from './UserRepository'
import { getCustomRepository, getRepository, Repository } from 'typeorm'
import { ActiveCondition } from '../models/ActiveCondition'

export class RepoContainer {
    userRepo: UserRepository;
    activeConditionRepo: Repository<ActiveCondition>

    constructor(connection: string) {
        this.userRepo=getCustomRepository(UserRepository,connection);
        this.activeConditionRepo = getRepository(ActiveCondition, connection);
    }
}

export default RepoContainer;