import logger from './utils/logger';
import DB from './utils/db';
import { createServer } from './utils/server';

const api_port = 3000;
const socket_port: number = api_port + 1;

DB.init()
  .then(() => {
    return createServer();
  })
  .then((server) => {
    server.socket.listen(socket_port, () => {
      logger.info(`Socket listening on http://localhost:${socket_port}`);
    });
  })
  .catch((err) => {
    logger.error(`Connection Error: ${err}`);
  });
