import { DamageType } from 'src/damage-types/entities/damage-type.entity'
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'

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
  overrides: Condition[]

  @ManyToOne(() => DamageType)
  damageType: DamageType
}
