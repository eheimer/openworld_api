import { EntityBase } from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne } from 'typeorm'
import { ArmorInstance } from './ArmorInstance'
import { DamageType } from './DamageType'

/**
 * @description a damage reduction that is applied to an ArmorInstance
 */
@Entity()
export class ArmorInstanceDamageReduction extends EntityBase {
  @Column() name: string
  @Column() value: number

  @ManyToOne(() => ArmorInstance)
  armor: ArmorInstance

  @ManyToOne(() => DamageType, { nullable: false })
  damageType: DamageType
}
