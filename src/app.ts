import logger from './utils/logger'
import DB, { runMigrations } from './utils/db'
import { createServer } from './utils/server'
import config from './config'

const http_port: number = config.port

DB.init()
  .then(() => {
    runMigrations()
  })
  .then(() => {
    return createServer()
  })
  .then((server) => {
    server.socket.listen(http_port, () => {
      logger.info(`Socket listening on http://localhost:${http_port}`)
    })
  })
  .catch((err) => {
    logger.error(`Connection Error: ${err}`)
  })
