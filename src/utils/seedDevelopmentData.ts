/**
 * Reseed the database with our original data set
 */
import logger from './logger'
import DB from './db'
import { TestSeeder } from '../seed/TestSeeder'

DB.init()
    .then(() => {
        //change this to DevelopmentSeeder once we have it
        return TestSeeder.seed(DB.getInstance())
    })
    .then(() => {
        return
    })
    .catch(err => {
        logger.error(`Database Init error: ${err}`)
    })