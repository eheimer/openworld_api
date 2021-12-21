import logger from './logger';
import { Server } from 'socket.io';
// import { fixedOrigin } from './corsFixer'

export default (app) => {
  const io = new Server(app, {
    // path: '/classic-mode'
    // origins: fixedOrigin(hosts)
  });

  io.on('connection', (socket) => {
    logger.info('Client connected');
  });

  return io;
};
