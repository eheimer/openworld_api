import logger from './utils/logger'
import DB from './utils/db'

DB.init()
    .then(() => {
        var server = require('./utils/server')
        return server.createServer()
    })
    .then(server => {
        server.listen(3000, () => {
            logger.info(`Listening on http://localhost:3000`)
        })
    })
    .catch(err => {
        logger.error(`Connection Error: ${err}`)
    })