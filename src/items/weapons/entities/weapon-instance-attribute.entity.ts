import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { SlayerType } from '../../../damage-types/entities/slayer-type.entity'
import { WeaponAttribute } from './weapon-attribute.entity'
import { WeaponInstance } from './weapon-instance.entity'

@Entity()
export class WeaponInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => WeaponInstance, (w) => w.attributes, { nullable: true })
  weapon: WeaponInstance

  @ManyToOne(() => WeaponAttribute, { nullable: false })
  attribute: WeaponAttribute

  @ManyToOne(() => SlayerType, { nullable: true })
  slayer: SlayerType
}
