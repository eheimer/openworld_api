import { Column, Entity, ManyToOne } from 'typeorm'
import { SpellbookAttribute } from "./spellbook-attribute.entity"
import { BaseEntity } from "../../../common/BaseEntity"
import { Skill } from "../../../skills/entities/skill.entity"
import { SlayerType } from "../../../damage-types/entities/slayer-type.entity"
import type { SpellbookInstance } from "./spellbook-instance.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class SpellbookInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => SpellbookAttribute, { nullable: false })
  attribute: SpellbookAttribute

  @ManyToOne(() => Skill, { nullable: true })
  skill: Skill

  @ManyToOne(() => SlayerType, { nullable: true })
  slayer: SlayerType

  @ManyToOne(() => getEntity('SpellbookInstance') as any, (s: any) => (s as any).attributes, { nullable: true })
  spellbook: any
}

registerEntity('SpellbookInstanceAttribute', SpellbookInstanceAttribute)
