import DB from './db'
import { TestSeeder } from '../seed/TestSeeder'

console.info('Starting....')

DB.init()
    .then(() => {
        console.info('DB initialized')
        TestSeeder.seed()
            .then(() => {
                console.info('Seeding complete')
            })
            .catch(err => {
                console.error(`Seeding error: ${err}`)
            })
    })
    .catch(err => {
        console.error(`Database Init error: ${err}`)
    })