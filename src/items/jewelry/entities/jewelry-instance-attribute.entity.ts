import { Skill } from "../../../skills/entities/skill.entity"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { JewelryAttribute } from "./jewelry-attribute.entity"
import type { JewelryInstance } from "./jewelry-instance.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class JewelryInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => getEntity('JewelryInstance') as any, (ji: any) => ji.attributes, { nullable: true })
  jewelry: any

  @ManyToOne(() => JewelryAttribute, { nullable: false })
  attribute: JewelryAttribute

  @ManyToOne(() => Skill, { nullable: true })
  skill: Skill
}

registerEntity('JewelryInstanceAttribute', JewelryInstanceAttribute)
