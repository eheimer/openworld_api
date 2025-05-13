import { INestApplication } from '@nestjs/common'
import { buildAuthorizedRequest } from './util'

export async function createBattle(app: INestApplication, token: string, gameId: number): Promise<number> {
  const response = await buildAuthorizedRequest(app, 'post', `/games/${gameId}/battles`, token).send()

  if (response.status !== 201) {
    console.error(response.body?.message || 'Unexpected error')
    throw new Error(`Failed to create battle: ${response.status}`)
  }

  return response.body.id
}
