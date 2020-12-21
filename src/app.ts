import { getConnection } from 'typeorm'
import logger from './utils/logger'
//import { createServer } from './utils/server'
import { createConnection, ConnectionOptionsReader } from 'typeorm'

import config from './config/index'

createConnection(config.env)
    .then(() => {
        var server = require("./utils/server")
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