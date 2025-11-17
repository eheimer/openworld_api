import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"

@Entity()
export class DamageType extends BaseEntity {
  @Column() name: string
  @Column({ type: 'text' }) description: string
  @Column() chaos: boolean
  @Column() display: boolean
  @Column() soundurl: string
  @Column() imgurl: string
}

(globalThis as any).DamageType = DamageType
