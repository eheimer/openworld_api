import { Skill } from '../../../skills/entities/skill.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { JewelryAttribute } from './jewelry-attribute.entity'
import { JewelryInstance } from './jewelry-instance.entity'

@Entity()
export class JewelryInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => JewelryInstance, (ji) => ji.attributes, { nullable: true })
  jewelry: JewelryInstance

  @ManyToOne(() => JewelryAttribute, { nullable: false })
  attribute: JewelryAttribute

  @ManyToOne(() => Skill, { nullable: true })
  skill: Skill
}
