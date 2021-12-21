import { SocketHandler } from '../../utils/SocketHandler'
import { TestHandler } from './test'

export const handlers: SocketHandler[] = [new TestHandler()]
