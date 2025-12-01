import { INestApplication } from '@nestjs/common'
import { APIUtils } from '../helpers/util'
import { registerAndLoginPlayer } from '../helpers/auth.helper'
import { createGame } from '../helpers/games.helper'
import { createCharacter } from '../helpers/characters.helper'
import { validate } from 'class-validator'

describe('CharactersController (Integration)', () => {
  let app: INestApplication
  let player: { id: number; username: string; token: string }
  let gameId: number
  let characterId: number

  beforeAll(async () => {
    app = await APIUtils.createApp()
    player = await registerAndLoginPlayer(app)
    gameId = await createGame(app, player.token)
    characterId = await createCharacter(app, player.token, gameId)
  })

  afterAll(async () => {
    await app.close()
  })

  test('GET /characters/:characterId should return a specific character', async () => {
    const response = await APIUtils.buildAuthorizedRequest(app, 'get', `/characters/${characterId}`, player.token).send()

    APIUtils.validateResponseStatus(response, 200)
    expect(response.body).toHaveProperty('id', characterId)
  })

  test('PATCH /characters/:characterId should update a character', async () => {
    const updateCharacterDto = { name: 'Updated Character' }
    const response = await APIUtils.buildAuthorizedRequest(app, 'patch', `/characters/${characterId}`, player.token).send(
      updateCharacterDto
    )

    APIUtils.validateResponseStatus(response, 200)
    expect(response.body).toHaveProperty('id', characterId)
    expect(response.body).toHaveProperty('name', 'Updated Character')
  })

  test('DELETE /characters/:characterId should remove a character', async () => {
    const newGameId = await createGame(app, player.token)
    const newCharacterId = await createCharacter(app, player.token, newGameId)
    const response = await APIUtils.buildAuthorizedRequest(app, 'delete', `/characters/${newCharacterId}`, player.token).send()

    expect(response.status).toBe(200)
    // attempt to get the character and verify 404
    const getResponse = await APIUtils.buildAuthorizedRequest(app, 'get', `/characters/${newCharacterId}`, player.token).send()
    APIUtils.validateResponseStatus(getResponse, 404)
  })
})
