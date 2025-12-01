import { INestApplication } from '@nestjs/common'
import { APIUtils } from '../api/helpers/util'

describe('Map functionality (e2e)', () => {
  let app: INestApplication
  let player: { playerId: number; username: string; token: string }

  beforeAll(async () => {
    app = await APIUtils.createApp()
    player = await APIUtils.registerAndLoginPlayer(app)
  })

  afterAll(async () => {
    await app.close()
  })

  it('should save and retrieve a map', async () => {
    const saveMapResponse = await APIUtils.buildAuthorizedRequest(app, 'post', '/map', player.token, [
      { tileIndex: 0, terrain: 0 },
      { tileIndex: 1, terrain: 0 },
      { tileIndex: 2, terrain: 0 },
      { tileIndex: 3, terrain: 0 },
      { tileIndex: 4, terrain: 0 },
      { tileIndex: 5, terrain: 0 },
      { tileIndex: 6, terrain: 0 },
      { tileIndex: 7, terrain: 0 },
      { tileIndex: 8, terrain: 0 },
      { tileIndex: 9, terrain: 0 }
    ])
    expect(saveMapResponse.status).toBe(201)

    const getMapResponse = await APIUtils.buildAuthorizedRequest(app, 'get', '/map', player.token)
    expect(getMapResponse.status).toBe(200)
    expect(getMapResponse.body).toBeInstanceOf(Array)
    expect(getMapResponse.body.length).toBeGreaterThan(0)
  })
})
