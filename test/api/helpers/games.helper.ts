import { INestApplication } from '@nestjs/common'
import { APIUtils } from './util'
import { v4 as uuidv4 } from 'uuid'

export async function createGame(app: INestApplication, token: string): Promise<number> {
  const createGameDto = { name: `Test Game ${uuidv4()}` }
  const response = await APIUtils.buildAuthorizedRequest(app, 'post', '/games', token).send(createGameDto)

  if (response.status !== 201) {
    throw new Error(`Failed to create game: ${response.status} - ${JSON.stringify(response.body)}`)
  }

  return response.body.id
}

export async function addPlayerToGame(
  app: INestApplication,
  token: string,
  gameId: number,
  playerId: number
): Promise<void> {
  const response = await APIUtils.buildAuthorizedRequest(app, 'post', `/games/${gameId}/players/${playerId}`, token).send()

  if (response.status !== 201) {
    throw new Error(`Failed to add player to game: ${response.status}`)
  }
  return response.body
}
