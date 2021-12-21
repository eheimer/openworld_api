import { Server } from 'socket.io';

import logger from './logger';
import { SocketHandler } from './SocketHandler';

export default (app, handlers: SocketHandler[]) => {
  const io = new Server(app, {
    // path: '/classic-mode'
    // origins: fixedOrigin(hosts)
  });

  io.on('connection', (socket) => {
    logger.info('Client connected');
    //console.log({ handlers })
    //register socket handlers
    for (const handler of handlers) {
      console.log('registering handler: ', handler.event);
      socket.on(handler.event, handler.on);
    }
  });

  return io;
};
