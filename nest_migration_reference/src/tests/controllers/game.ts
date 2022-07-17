import APITestHelper from '../../utils/tests/apiTestHelper'
import APIValidator from '../../utils/tests/apiValidator'
import CreateGameRequest from '../../api/dto/request/CreateGameRequest'
import UpdateGameRequest from '../../api/dto/request/UpdateGameRequest'
import GameResponse from '../../api/dto/response/GameResponse'
import Error from '../../api/dto/Error'

const helper = new APITestHelper()

beforeAll(async () => {
  await APIValidator.init()
  await helper.authenticate()
})

let gameId

describe('Create and retrieve a game', () => {
  let gameLoc
  describe('POST /games', () => {
    it('should create a new game', async () => {
      const data = new CreateGameRequest({ maxPlayers: 10, name: 'Test Game' })
      const res = await helper.post('/games', data)

      expect(res.status).toEqual(201)
      expect(res).toSatisfyApiSpec()
      gameLoc = res.headers.location
    })
  })
  describe('GET {gameloc}', () => {
    it('should retrieve game from location header', async () => {
      const res = await helper.get(gameLoc)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const game = new GameResponse(res.data)
      expect(game.maxPlayers).toEqual(10)
      gameId = game.id
    })
  })
})
describe('update game and verify', () => {
  describe('PATCH /games/{gameId}', () => {
    it('should update game', async () => {
      const data = new UpdateGameRequest({ maxPlayers: 20 })
      const res = await helper.patch(`/games/${gameId}`, data)
      expect(res.status).toEqual(204)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('GET /games/{gameId}', () => {
    it('should retrieve updated game', async () => {
      const res = await helper.get(`/games/${gameId}`)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const game = new GameResponse(res.data)
      expect(game.maxPlayers).toEqual(20)
    })
  })
})
describe('Remove game and verify', () => {
  describe('DELETE /games/{gameId}', () => {
    it('should remove game', async () => {
      const res = await helper.delete(`/games/${gameId}`)

      expect(res.status).toEqual(204)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('GET /games/{gameId}', () => {
    it('should fail retrieving game', async () => {
      let res
      try {
        await helper.get(`/games/${gameId}`)
      } catch (err) {
        expect(err.response.status).toEqual(404)
        expect(err.response).toSatisfyApiSpec()
        const error = new Error(err.response.data.error)
        expect(error.type).toEqual('not_found')
      }
      expect(res).toBeUndefined()
    })
  })
})
