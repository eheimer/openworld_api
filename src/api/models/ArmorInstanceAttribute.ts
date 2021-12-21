import { EntityBase } from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne } from 'typeorm'
import { ArmorAttribute } from './ArmorAttribute'
import { ArmorInstance } from './ArmorInstance'
import { DamageType } from './DamageType'

/**
 * @description an ArmorAttribute that is applied to an ArmorInstance
 */
@Entity()
export class ArmorInstanceAttribute extends EntityBase {
  /**
   * the calculated value of the attribute
   */
  @Column() value: number

  @ManyToOne(() => ArmorInstance, { nullable: true })
  armor: ArmorInstance

  @ManyToOne(() => ArmorAttribute, { nullable: false })
  attribute: ArmorAttribute

  @ManyToOne(() => DamageType, { nullable: true })
  damageType: DamageType
}
