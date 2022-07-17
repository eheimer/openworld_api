/**
 * Reseed the database with our original data set
 */
import logger from './logger'
import DB from './db'
import { getConnection } from 'typeorm'

DB.init()
  .then(async () => {
    await getConnection(DB.getInstance().conn).runMigrations()
  })
  .then(() => {
    return
  })
  .catch((err) => {
    logger.error(`Database Init error: ${err}`)
  })
