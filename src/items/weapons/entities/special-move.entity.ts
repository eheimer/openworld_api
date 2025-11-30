import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"

@Entity()
export class SpecialMove extends BaseEntity {
  @Column() name: string
  @Column() stamina: number
}

