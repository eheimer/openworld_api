import { Skill } from "../../../skills/entities/skill.entity.js"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { JewelryAttribute } from "./jewelry-attribute.entity.js"
import type { JewelryInstance } from "./jewelry-instance.entity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

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
