import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { registerEntity } from "../../../entityRegistry.js"

@Entity()
export class SpecialMove extends BaseEntity {
  @Column() name: string
  @Column() stamina: number
}

registerEntity('SpecialMove', SpecialMove)
