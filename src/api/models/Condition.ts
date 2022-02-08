import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm'
import DamageType from './DamageType'

@Entity()
export default class Condition extends EntityBase {
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
