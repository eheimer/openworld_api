import { createConnection, EntityTarget, getConnection, getRepository, Repository } from 'typeorm'
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

  conn: string
  repos: RepoContainer

  static async init(): Promise<DB> {
    if (DB._instance) {
      logger.warn('Attempting to re-initialize the database')
      return null
    } else {
      DB._instance = new DB()
      await createConnection(conf.env)
      DB._instance.conn = conf.env
      DB._instance.repos = new RepoContainer(conf.env)
    }
    return DB._instance
  }
}

export async function runMigrations(): Promise<void> {
  if (conf.runMigrations) {
    await getConnection(DB.getInstance().conn).runMigrations()
  }
}

export function getRepos() {
  return DB.getInstance().repos
}

export function getRepo<Entity>(classname: string, entityType?: EntityTarget<Entity>): Repository<Entity> {
  let repo = DB.getInstance().repos[classname]
  if (!repo) {
    repo = getRepository(entityType, DB.getInstance().conn)
    DB.getInstance().repos[classname] = repo
  }
  return repo
}

export default DB