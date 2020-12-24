import logger from './logger'
import DB from './db'
import { TestSeeder } from '../seed/TestSeeder'

DB.init()
    .then(() => {
        return TestSeeder.seed(DB.getInstance())
    })
    .then(() => {
        return
    })
    .catch(err => {
        logger.error(`Database Init error: ${err}`)
    })