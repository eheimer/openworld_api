import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"

@Entity()
export class GemRarity extends BaseEntity {
  @Column() name: string
  @Column() durability: number
}

