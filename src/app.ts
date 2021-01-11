import logger from './utils/logger'
import DB from './utils/db'

const api_port : number = 3000
const socket_port : number = api_port + 1

DB.init()
    .then(() => {
        var server = require('./utils/server')
        return server.createServer()
    })
    .then(server => {
        server.api.listen(api_port, () => {
            logger.info(`API listening on http://localhost:${api_port}`)
        })
        server.socket.listen(socket_port, () => {
            logger.info(`Socket listening on http://localhost:${socket_port}`)
        })
    })
    .catch(err => {
        logger.error(`Connection Error: ${err}`)
    })