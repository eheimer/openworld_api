import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { ArmorClass } from './armor-class.entity'
import { DamageType } from '../../../damage-types/entities/damage-type.entity'

@Entity()
export class ArmorClassDamageReduction extends BaseEntity {
  @Column() level: number
  @Column() reduction: string

  @ManyToOne(() => ArmorClass)
  armorClass: ArmorClass

  @ManyToOne(() => DamageType)
  damageType: DamageType
}
