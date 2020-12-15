import db from '@openworld/utils/db'
import logger from '@openworld/utils/logger'
import { createServer } from './utils/server'

db.open()
    .then(() => createServer())
    .then(server => {
        server.listen(3000, () => {
            logger.info(`Listening on http://localhost:3000`)
        })
    })
    .catch(err => {
        logger.error(`Error: ${err}`)
    })