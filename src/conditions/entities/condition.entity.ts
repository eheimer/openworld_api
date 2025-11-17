import { DamageType } from "../../damage-types/entities/damage-type.entity.js"
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"

@Entity()
export class Condition extends BaseEntity {
  @Column() name: string
  @Column() actionReplace: string
  @Column() duration: number
  @Column() damage: string
  @Column() delay: number
  @Column() cooldown: number
  @Column() removeOnHit: boolean
  @Column() allowMultiple: boolean

  @ManyToMany(() => Condition)
  @JoinTable({
    name: 'condition_overrides_condition',
    joinColumn: { name: 'conditionId_1' },
    inverseJoinColumn: { name: 'conditionId_2' }
  })
  @JoinColumn()
  overrides: Condition[]

  @ManyToOne(() => DamageType)
  damageType: DamageType
}

(globalThis as any).Condition = Condition
