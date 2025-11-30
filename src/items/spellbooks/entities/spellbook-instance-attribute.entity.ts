import { Column, Entity, ManyToOne } from 'typeorm'
import { SpellbookAttribute } from './spellbook-attribute.entity'
import { BaseEntity } from '../../../common/BaseEntity'
import { Skill } from '../../../skills/entities/skill.entity'
import { SlayerType } from '../../../damage-types/entities/slayer-type.entity'
import { SpellbookInstance } from './spellbook-instance.entity'

@Entity()
export class SpellbookInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => SpellbookAttribute, { nullable: false })
  attribute: SpellbookAttribute

  @ManyToOne(() => Skill, { nullable: true })
  skill: Skill

  @ManyToOne(() => SlayerType, { nullable: true })
  slayer: SlayerType

  @ManyToOne(() => SpellbookInstance, (s) => s.attributes, { nullable: true })
  spellbook: SpellbookInstance
}
