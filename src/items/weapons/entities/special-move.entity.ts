import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { registerEntity } from "../../../entityRegistry"

@Entity()
export class SpecialMove extends BaseEntity {
  @Column() name: string
  @Column() stamina: number
}

registerEntity('SpecialMove', SpecialMove)
