import APIValidator from '../../utils/tests/apiValidator'
import APITestHelper from '../../utils/tests/apiTestHelper'
import CreateGameRequest from '../../api/dto/request/CreateGameRequest'
import RegisterRequest from '../../api/dto/request/RegisterRequest'
import GameResponse from '../../api/dto/response/GameResponse'
import faker from 'faker'
import GameCharacter from '../../api/dto/GameCharacter'

let gameId
let player2
const helper = new APITestHelper()

beforeAll(async () => {
  await APIValidator.init()
  await helper.authenticate()
  const gameReq = new CreateGameRequest({ maxPlayers: 10, name: faker.random.words(2) })
  const create = await helper.post('/games', gameReq)
  const get = await helper.get(create.headers.location)
  gameId = get.data.id
  const playerReq = new RegisterRequest({
    email: faker.internet.email(),
    name: faker.name.firstName(),
    password: faker.random.word()
  })
  const register = await helper.post('/players', playerReq, true)
  const getPlayer2 = await helper.get(register.headers.location)
  player2 = getPlayer2.data.id
})

describe('Add a player to a game', () => {
  describe('POST /games/{gameId}/players/{playerId}', () => {
    it('should add a player to the game', async () => {
      const res = await helper.post(`/games/${gameId}/players/${player2}`, {})
      expect(res.status).toEqual(204)
    })
  })
  describe('GET /games/{gameId}', () => {
    it('should verify player has been added to the game', async () => {
      const res = await helper.get(`/games/${gameId}`)
      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const game = new GameResponse(res.data)
      expect(game.players).toContain(player2)
    })
  })
  describe('GET /players/{playerId}/games', () => {
    it('should verify player has game', async () => {
      const res = await helper.get(`/players/${player2}/games`)
      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const games = (res.data as GameCharacter[]).map((item) => item.game.id)
      expect(games).toContain(gameId)
    })
  })
})
describe('Remove player from game', () => {
  describe('DELETE /games/{gameId}/players/{playerId}', () => {
    it('should remove player from game', async () => {
      const res = await helper.delete(`/games/${gameId}/players/${player2}`)
      expect(res.status).toEqual(204)
    })
  })
  describe('GET /games/{gameId}', () => {
    it('should verify player has been removed from the game', async () => {
      const res = await helper.get(`/games/${gameId}`)
      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const game = new GameResponse(res.data)
      expect(game.players).not.toContain(player2)
    })
  })
})
