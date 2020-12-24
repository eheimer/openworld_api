import { createConnection, getConnection, getCustomRepository, getRepository, Repository } from 'typeorm'
import conf from '../config'

import RepoContainer from '../api/repositories'
import logger from './logger'

export class DB {

    private static _instance: DB

    static getInstance(): DB {
        if (!DB._instance) {
            logger.warn('Attempting to retrieve database instance before it has been initialized.')
        }
        return DB._instance
    }

    repos: RepoContainer

    static async init(): Promise<DB> {
        if (DB._instance) {
            logger.warn('Attempting to re-initialize the database')
            return null
        } else {
            let conn = await createConnection(conf.env)
            DB._instance = new DB()
            DB.getInstance().repos = new RepoContainer(conf.env)
        }
        return DB._instance
    }

}

export function getRepos() {
    return DB.getInstance().repos
}

export default DB
