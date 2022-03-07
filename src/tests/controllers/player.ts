import RegisterRequest from '../../api/dto/request/RegisterRequest'
import APITestHelper from '../../utils/tests/apiTestHelper'
import APIValidator from '../../utils/tests/apiValidator'
import Error from '../../api/dto/Error'
import PlayerResponse from '../../api/dto/response/PlayerResponse'
import faker from 'faker'

const helper = new APITestHelper()
let player: string

beforeAll(async () => {
  await APIValidator.init()
})

describe('Register a player, authenticate, retrieve player details', () => {
  describe('POST /players', () => {
    it('should register new player', async () => {
      const data = new RegisterRequest({ email: 'eric@heimerman.org', name: 'eric', password: 'eric' })
      const res = await helper.post('/players', data, true)

      expect(res.status).toEqual(201)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('POST /login', () => {
    it('should satisfy OpenAPI spec', async () => {
      const data = { email: 'eric@heimerman.org', password: 'eric' }
      const res = await helper.post('/login', data, true)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()

      helper.token = res.data.token
      player = res.data.player
    })
  })
  describe('GET /players/{playerId}/detail', () => {
    it('should retrieve player detail', async () => {
      const res = await helper.get(`/players/${player}/detail`)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
    })
  })
})
describe('Register a player and retrieve it from the location header', () => {
  let player2loc
  let player2
  describe('POST /players', () => {
    it('should register new player', async () => {
      const data = new RegisterRequest({
        email: faker.internet.email(),
        name: faker.name.firstName(),
        password: faker.random.word()
      })
      const res = await helper.post('/players', data, true)

      expect(res.status).toEqual(201)
      expect(res).toSatisfyApiSpec()
      player2loc = res.headers.location
    })
  })
  describe('GET {player2loc}', () => {
    it('should retrieve public player from Location header', async () => {
      const res = await helper.get(player2loc)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()

      const player = new PlayerResponse(res.data)

      player2 = player.id
    })
  })
  describe('GET /players/{playerId}/detail', () => {
    it('should fail retrieving player2 detail', async () => {
      let res
      try {
        res = await helper.get(`/players/${player2}/detail`)
      } catch (err) {
        expect(err.response.status).toEqual(401)
        expect(err.response).toSatisfyApiSpec()
        const error = new Error(err.response.data.error)
        expect(error.type).toEqual('authorization_failed')
      }
      expect(res).toBeUndefined()
    })
  })
})
