import axios from 'axios'
import config from '../../config'
import logger from '../../utils/logger'
import auth from '../../utils/tests/auth'
import CreateGameRequest from '../../api/dto/request/CreateGameRequest'

beforeAll(async () => {
  await auth.setUp()
})

describe('Create a game', () => {
  it('should create a new game', async () => {
    const data = new CreateGameRequest({ maxPlayers: 10, name: 'Test Game' })
    const res = await axios.post(`http://localhost:${config.port}/api/v1/games`, data, auth.getAuthHeader())

    expect(res.status).toEqual(201)
    expect(res).toSatisfyApiSpec()
  })
})
