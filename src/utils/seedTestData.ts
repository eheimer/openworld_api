/* eslint-disable no-console */
import { TestSeeder } from '../seed/TestSeeder'
import DB from './db'

console.info('Starting....')

DB.init()
  .then(async () => {
    console.info('DB initialized')
    TestSeeder.seed()
      .then(() => {
        console.info('Seeding complete')
      })
      .catch((err) => {
        console.error(`Seeding error: ${err}`)
      })
  })
  .catch((err) => {
    console.error(`Database Init error: ${err}`)
  })
