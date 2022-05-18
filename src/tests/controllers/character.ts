import faker from 'faker'

import CharacterDetail from '../../api/dto/CharacterDetail'
import Error from '../../api/dto/Error'
import CreateCharacterRequest from '../../api/dto/request/CreateCharacterRequest'
import CreateGameRequest from '../../api/dto/request/CreateGameRequest'
import UpdateCharacterRequest from '../../api/dto/request/UpdateCharacterRequest'
import UpdateCharacterSkillRequest from '../../api/dto/request/UpdateCharacterSkillRequest'
import CharacterDetailResponse from '../../api/dto/response/CharacterDetailResponse'
import CharacterResponse from '../../api/dto/response/CharacterResponse'
import APITestHelper from '../../utils/tests/apiTestHelper'
import APIValidator from '../../utils/tests/apiValidator'
import CreateCharacterSkillRequest from '../../api/dto/request/CreateCharacterSkillRequest'

let gameId
let charId
let skillName
let cSkillId
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
        strength: 3,
        dexterity: 2,
        intelligence: 1,
        movement: 2
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
      expect(resp.hp).toEqual(1)
      expect(resp.inventorySize).toBeGreaterThan(1)
      expect(resp.maxStamina).toBeGreaterThan(1)
      expect(resp.swingSpeed).toBeLessThanOrEqual(0)
      expect(resp.castSpeed).toBeLessThanOrEqual(0)
      expect(resp.healSpeed).toBeLessThanOrEqual(0)
      expect(resp.strength).toEqual(3)
      expect(resp.dexterity).toEqual(2)
      expect(resp.intelligence).toEqual(1)
      expect(resp.movement).toEqual(2)
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
  newHelper.authenticate()
  it('should fail retrieving character detail', async () => {
    let res
    try {
      res = await newHelper.get(`/characters/${charId}/detail`)
    } catch (err) {
      expect(err.response.status).toEqual(401)
      expect(err.response).toSatisfyApiSpec()
      const error = new Error(err.response.data.error)
      expect(error.type).toEqual('authorization_failed')
      expect(error.message).toEqual('Character operation not available to requestor')
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
      expect(error.message).toEqual('Character operation not available to requestor')
    }
    expect(res).toBeUndefined()
  })
})
describe('update character and verify', () => {
  describe('PATCH /characters/{char}', () => {
    it('should update character', async () => {
      const data = new UpdateCharacterRequest({ intelligence: 2 })
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
      expect(resp.strength).toEqual(3)
      expect(resp.dexterity).toEqual(2)
      expect(resp.intelligence).toEqual(2)
      expect(resp.movement).toEqual(2)
    })
  })
})

describe('add character skill and verify', () => {
  describe('add character skill', () => {
    it('should add a characterskill to the character', async () => {
      const skills = await helper.get('skills')
      expect(skills.data).toBeInstanceOf(Array)
      expect(skills.data.length).toBeGreaterThan(0)
      skillName = skills.data[0].name
      const res = await helper.post(
        `characters/${charId}/skills`,
        new CreateCharacterSkillRequest({ skillId: skills.data[0].id })
      )
      expect(res.status).toEqual(204)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('verify add character skill', () => {
    it('should retrieve updated character', async () => {
      const char = await helper.get(`characters/${charId}/detail`)
      const detail = new CharacterDetail(char.data)
      expect(detail.skills).toBeInstanceOf(Array)
      expect(detail.skills.length).toEqual(1)
      expect(detail.skills[0].name).toEqual(skillName)
      expect(detail.skills[0].level).toEqual(1)
      cSkillId = detail.skills[0].id
    })
  })
})
describe('update character skill level and verify', () => {
  describe('update character skill level', () => {
    it('should update a characterskill level', async () => {
      const req = new UpdateCharacterSkillRequest({ level: 2 })
      const res = await helper.patch(`characters/${charId}/skills/${cSkillId}`, req)
      expect(res.status).toEqual(204)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('verify update character skill', () => {
    it('should retrieve updated character', async () => {
      const char = await helper.get(`characters/${charId}/detail`)
      const detail = new CharacterDetail(char.data)
      expect(detail.skills).toBeInstanceOf(Array)
      expect(detail.skills.length).toEqual(1)
      expect(detail.skills[0].name).toEqual(skillName)
      expect(detail.skills[0].level).toEqual(2)
    })
  })
})
describe('remove character skill and verify', () => {
  describe('remove character skill', () => {
    it('should remove a characterskill from the character', async () => {
      const res = await helper.delete(`characters/${charId}/skills/${cSkillId}`)
      expect(res.status).toEqual(204)
      expect(res).toSatisfyApiSpec()
    })
  })
  describe('verify remove character skill', () => {
    it('should retrieve updated character', async () => {
      const char = await helper.get(`characters/${charId}/detail`)
      const detail = new CharacterDetail(char.data)
      expect(detail.skills).toBeInstanceOf(Array)
      expect(detail.skills.length).toEqual(0)
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
