import { Entity } from 'typeorm'

@Entity()
export class DamageResponse {
  /**
   * @description returned in response to equipment taking damage
   *
   * @param result string, either 'damaged' or 'destroyed'
   */
  constructor(result: string) {
    this.result = result
  }

  result: string
}
