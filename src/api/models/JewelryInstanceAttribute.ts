import { Column, Entity, ManyToOne } from 'typeorm'

import { EntityBase } from '../../utils/entities/EntityBase'
import { JewelryAttribute } from './JewelryAttribute'
import { JewelryInstance } from './JewelryInstance'
import { Skill } from './Skill'

@Entity()
export class JewelryInstanceAttribute extends EntityBase {
  @Column() value: number

  @ManyToOne(() => JewelryInstance, (ji) => ji.attributes, { nullable: true })
  jewelry: JewelryInstance

  @ManyToOne(() => JewelryAttribute, { nullable: false })
  attribute: JewelryAttribute

  @ManyToOne(() => Skill, { nullable: true })
  skill: Skill
}
