// Autogenerated 2/19/2022 4:02:06 PM
import { Entity } from 'typeorm'
import PublicCharacter from '../PublicCharacter'

/**
 * description - character response
 *
 */
@Entity()
export class CharacterResponse extends PublicCharacter {
  constructor(item: any) {
    super(item)
  }
}

export default CharacterResponse
