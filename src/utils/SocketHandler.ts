import { Socket } from 'socket.io';

export abstract class SocketHandler {
  event: string;
  async on(socket: Socket, msg: string) {
    return;
  }
}
