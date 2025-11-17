import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"

@Entity()
export class SpecialMove extends BaseEntity {
  @Column() name: string
  @Column() stamina: number
}

(globalThis as any).SpecialMove = SpecialMove
