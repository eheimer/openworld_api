import { getConnection } from 'typeorm'
import logger from './utils/logger'
//import { createServer } from './utils/server'
import { createConnection } from 'typeorm'

import config from './config/index'

console.log({env: config.env})
createConnection('dev')
    .then(() => {
        console.log('creating server')
        var server = require("./utils/server");
        return server.createServer()
    })
    .then(server => {
        console.log('starting server')
        server.listen(3000, () => {
            logger.info(`Listening on http://localhost:3000`)
        })
    })
    .catch(err => {
        console.log('error')
        logger.error(`Error: ${err}`)
    })