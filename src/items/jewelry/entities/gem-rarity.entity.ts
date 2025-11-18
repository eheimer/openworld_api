import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

@Entity()
export class GemRarity extends BaseEntity {
  @Column() name: string
  @Column() durability: number
}

registerEntity('GemRarity', GemRarity)
