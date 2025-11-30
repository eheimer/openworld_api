import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class GemRarity extends BaseEntity {
  @Column() name: string
  @Column() durability: number
}

registerEntity('GemRarity', GemRarity)
