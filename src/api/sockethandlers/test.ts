import SocketHandler from '../../utils/SocketHandler'

export default class TestHandler implements SocketHandler {
  event = `test`
  on(msg: any): Promise<void> {
    console.log(`Received test message:`, msg)
    return
  }
}
