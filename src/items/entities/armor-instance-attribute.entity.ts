import { DamageType } from '../../damage-types/entities/damage-type.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { ArmorAttribute } from './armor-attribute.entity'
import { ArmorInstance } from './armor-instance.entity'

@Entity()
export class ArmorInstanceAttribute extends BaseEntity {
  @Column() value: number
  @ManyToOne(() => ArmorInstance, { nullable: true })
  armor: ArmorInstance

  @ManyToOne(() => ArmorAttribute, { nullable: false })
  attribute: ArmorAttribute

  @ManyToOne(() => DamageType, { nullable: true })
  damageType: DamageType
}
