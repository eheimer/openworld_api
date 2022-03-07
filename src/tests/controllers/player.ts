import axios from 'axios'
import config from '../../config'
import RegisterRequest from '../../api/dto/request/RegisterRequest'
import logger from '../../utils/logger'
import AuthInitializer from '../../utils/tests/auth'

beforeAll(async () => {
  await AuthInitializer.initJestOpenAPI()
})

let token
let player

describe('Register a player, authenticate, retrieve player details', () => {
  describe('POST /players', () => {
    it('should register new player', async () => {
      const data = new RegisterRequest({ email: 'eric@heimerman.org', name: 'eric', password: 'eric' })
      const res = await axios.post(`http://localhost:${config.port}/api/v1/players`, data)

      expect(res.status).toEqual(201)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('POST /login', () => {
    it('should satisfy OpenAPI spec', async () => {
      // Get an HTTP response from your server (e.g. using axios)
      const data = { email: 'eric@heimerman.org', password: 'eric' }
      const res = await axios.post(`http://localhost:${config.port}/api/v1/login`, data)

      expect(res.status).toEqual(200)

      // Assert that the HTTP response satisfies the OpenAPI spec
      expect(res).toSatisfyApiSpec()

      token = res.data.token
      player = res.data.player
    })
  })
  describe('GET /players/{playerId}/detail', () => {
    it('should retrieve player detail', async () => {
      const url = `http://localhost:${config.port}/api/v1/players/${player}/detail`
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      })

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
      const data = new RegisterRequest({ email: 'eric2@heimerman.org', name: 'eric', password: 'eric' })
      const res = await axios.post(`http://localhost:${config.port}/api/v1/players`, data)

      expect(res.status).toEqual(201)
      expect(res).toSatisfyApiSpec()
      player2loc = res.headers.location
    })
  })
  describe('GET {player2loc}', () => {
    it('should retrieve public player from Location header', async () => {
      const url = `http://localhost:${config.port}${player2loc}`
      const header = `Bearer ${token}`
      const res = await axios.get(url, {
        headers: { Authorization: header }
      })

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()

      player2 = res.data.id
    })
  })
  describe('GET /players/{playerId}/detail', () => {
    it('should fail retrieving player2 detail', async () => {
      const url = `http://localhost:${config.port}/api/v1/players/${player2}/detail`
      const header = `Bearer ${token}`
      let res
      try {
        res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } catch (err) {
        expect(err.response.status).toEqual(401)
        expect(err.response.data).toEqual({ error: { type: 'authorization_failed' } })
        expect(err.response).toSatisfyApiSpec()
      }
      expect(res).toBeUndefined()
    })
  })
})
