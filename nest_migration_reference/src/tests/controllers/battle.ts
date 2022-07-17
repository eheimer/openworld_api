import APIValidator from '../../utils/tests/apiValidator'
import APITestHelper from '../../utils/tests/apiTestHelper'
import CreateGameRequest from '../../api/dto/request/CreateGameRequest'
import faker from 'faker'
import CreateCharacterRequest from '../../api/dto/request/CreateCharacterRequest'

let gameId
let charId
const helper = new APITestHelper()
let battleId

beforeAll(async () => {
  await APIValidator.init()
  await helper.authenticate()
  const gameReq = new CreateGameRequest({ maxPlayers: 10, name: faker.random.words(2) })
  const create = await helper.post('/games', gameReq)
  const get = await helper.get(create.headers.location)
  gameId = get.data.id
  const charReq = new CreateCharacterRequest({
    name: faker.name.firstName(),
    strength: 3,
    dexterity: 2,
    intelligence: 1,
    movement: 2
  })
  const createChar = await helper.post(`/games/${gameId}/characters`, charReq)
  const getChar = await helper.get(createChar.headers.location)
  charId = getChar.data.id
})

describe('create and retrieve a battle', () => {
  let battleloc
  describe('POST /games/{gameId}/battles', () => {
    it('should create a battle', async () => {
      const res = await helper.post(`/games/${gameId}/battles`, {})

      expect(res.status).toEqual(201)
      expect(res).toSatisfyApiSpec()
      battleloc = res.headers.location
    })
  })
  describe('GET /games/{gameId}/battles/{battleId}', () => {
    it('should get battle from header location', async () => {
      const res = await helper.get(battleloc)
      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      battleId = res.data.id
    })
  })
  describe('GET /games/{gameId}/battles', () => {
    it('should get collection of battles for game', async () => {
      const res = await helper.get(`games/${gameId}/battles`)
      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      expect(new Array(...res.data).map((i) => i.id)).toContain(battleId)
    })
  })
})
