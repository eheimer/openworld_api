import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { getEntity, registerEntity } from "../../entityRegistry"

@Entity()
export class DamageType extends BaseEntity {
  @Column() name: string
  @Column({ type: 'text' }) description: string
  @Column() chaos: boolean
  @Column() display: boolean
  @Column() soundurl: string
  @Column() imgurl: string
}

registerEntity('DamageType', DamageType)
