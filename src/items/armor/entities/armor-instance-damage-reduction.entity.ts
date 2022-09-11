import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { ArmorInstance } from './armor-instance.entity'
import { DamageType } from '../../../damage-types/entities/damage-type.entity'

@Entity()
export class ArmorInstanceDamageReduction extends BaseEntity {
  @Column() name: string
  @Column() value: number

  @ManyToOne(() => ArmorInstance)
  armor: ArmorInstance

  @ManyToOne(() => DamageType, { nullable: false })
  damageType: DamageType
}
