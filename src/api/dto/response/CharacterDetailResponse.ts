// Autogenerated 2/19/2022 4:49:06 PM
import { Entity } from 'typeorm'
import CharacterDetail from '../CharacterDetail'

/**
 * @description - character response
 */
@Entity()
export class CharacterDetailResponse extends CharacterDetail {
  constructor(item: any) {
    super(item)
  }
}

export default CharacterDetailResponse
