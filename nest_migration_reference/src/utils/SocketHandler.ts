import { Socket } from 'socket.io'

export default abstract class SocketHandler {
  event: string
  async on(socket: Socket, msg: string) {
    return
  }
}
