import APIValidator from '../../utils/tests/apiValidator'
import APITestHelper from '../../utils/tests/apiTestHelper'
import CreateGameRequest from '../../api/dto/request/CreateGameRequest'
import faker from 'faker'
import CreateCharacterRequest from '../../api/dto/request/CreateCharacterRequest'
import Error from '../../api/dto/Error'
import UpdateCharacterRequest from '../../api/dto/request/UpdateCharacterRequest'
import CharacterDetailResponse from '../../api/dto/response/CharacterDetailResponse'
import CharacterResponse from '../../api/dto/response/CharacterResponse'

let gameId
let charId
const helper = new APITestHelper()

beforeAll(async () => {
  await APIValidator.init()
  await helper.authenticate()
  const gameReq = new CreateGameRequest({ maxPlayers: 10, name: faker.random.words(2) })
  const create = await helper.post('/games', gameReq)
  const get = await helper.get(create.headers.location)
  gameId = get.data.id
})

describe('Create and retrieve a character', () => {
  let charloc
  describe('POST /games/{gameId}/characters', () => {
    it('should create a character', async () => {
      const charReq = new CreateCharacterRequest({
        name: faker.name.firstName(),
        maxHp: 100,
        baseResist: 10,
        inventorySize: 10
      })
      const res = await helper.post(`/games/${gameId}/characters`, charReq)

      expect(res.status).toEqual(201)
      expect(res).toSatisfyApiSpec()
      charloc = res.headers.location
    })
  })
  describe('GET /characters/{characterId}', () => {
    it('should retrieve character from location header', async () => {
      const res = await helper.get(charloc)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const resp = new CharacterResponse(res.data)
      charId = resp.id
    })
  })
  describe('GET /characters/{characterId}/detail', () => {
    it('should retrieve character detail', async () => {
      const res = await helper.get(`characters/${charId}/detail`)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const resp = new CharacterDetailResponse(res.data)
      expect(resp.maxHp).toEqual(100)
    })
  })
  describe('GET /games/{gameId}/characters', () => {
    it('should retrieve characters in the game', async () => {
      const res = await helper.get(`/games/${gameId}/characters`)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      expect(res.data).toContain(charId)
    })
  })
})
describe('Attempt to retrieve character detail and delete character from another account', () => {
  const newHelper = new APITestHelper()
  it('should fail retrieving character detail', async () => {
    let res
    try {
      res = await newHelper.get(`/characters/${charId}/detail`)
    } catch (err) {
      expect(err.response.status).toEqual(401)
      expect(err.response).toSatisfyApiSpec()
      const error = new Error(err.response.data.error)
      expect(error.type).toEqual('authorization_failed')
    }
    expect(res).toBeUndefined()
  })
  it('should fail deleting character', async () => {
    let res
    try {
      res = await newHelper.delete(`/characters/${charId}`)
    } catch (err) {
      expect(err.response.status).toEqual(401)
      expect(err.response).toSatisfyApiSpec()
      const error = new Error(err.response.data.error)
      expect(error.type).toEqual('authorization_failed')
    }
    expect(res).toBeUndefined()
  })
})
describe('update character and verify', () => {
  describe('PATCH /characters/{char}', () => {
    it('should update character', async () => {
      const data = new UpdateCharacterRequest({ maxHp: 120 })
      const res = await helper.patch(`/characters/${charId}`, data)
      expect(res.status).toEqual(204)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('GET /characters/{charId}', () => {
    it('should retrieve updated character', async () => {
      const res = await helper.get(`/characters/${charId}/detail`)

      expect(res.status).toEqual(200)
      expect(res).toSatisfyApiSpec()
      const resp = new CharacterDetailResponse(res.data)
      expect(resp.maxHp).toEqual(120)
    })
  })
})
describe('delete character and verify', () => {
  describe('DELETE /characters/{charId}', () => {
    it('should remove character', async () => {
      const res = await helper.delete(`/characters/${charId}`)

      expect(res.status).toEqual(204)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('GET /games/{gameId}', () => {
    it('should fail retrieving character', async () => {
      let res
      try {
        await helper.get(`/characters/${charId}`)
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
