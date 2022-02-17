import { Entity } from 'typeorm'
import ItemDamageType from './ItemDamageType'

@Entity()
export class ItemDamageResponse {
  /**
   * @description returned in response to equipment taking damage
   *
   * @param result string, either 'damaged' or 'destroyed'
   */
  constructor(args: any) {
    const { result } = args
    this.result = result
  }

  result: ItemDamageType
}

export default ItemDamageResponse
