import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"

@Entity()
export class GemRarity extends BaseEntity {
  @Column() name: string
  @Column() durability: number
}

(globalThis as any).GemRarity = GemRarity
