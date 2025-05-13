import { INestApplication } from '@nestjs/common'
import { buildAuthorizedRequest } from './util'
import { v4 as uuidv4 } from 'uuid'

export async function createCharacter(app: INestApplication, token: string, gameId: number): Promise<number> {
  const createCharacterDto = {
    name: `Test Character ${uuidv4()}`,
    strength: 10,
    dexterity: 10,
    intelligence: 10,
    raceId: 1
  }
  const response = await buildAuthorizedRequest(app, 'post', `/games/${gameId}/characters`, token).send(
    createCharacterDto
  )

  if (response.status !== 201) {
    console.error(response.body?.message || 'Unexpected error')
    throw new Error(`Failed to create character: ${response.status}`)
  }

  return response.body.id
}
