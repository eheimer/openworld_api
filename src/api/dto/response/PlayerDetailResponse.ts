// Autogenerated 2/20/2022 12:12:09 PM
//   by GenerateServerModels. DO NOT MODIFY
import { Entity } from 'typeorm'
import PlayerDetail from '../PlayerDetail'

/**
 * @description - player details
 */
@Entity()
export class PlayerDetailResponse extends PlayerDetail {
  constructor(item: any) {
    super(item)
  }
}

export default PlayerDetailResponse
