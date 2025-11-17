import { Skill } from "../../../skills/entities/skill.entity.js"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { JewelryAttribute } from "./jewelry-attribute.entity.js"
import type { JewelryInstance } from "./jewelry-instance.entity.js"

@Entity()
export class JewelryInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => (globalThis as any).JewelryInstance, (ji: any) => ji.attributes, { nullable: true })
  jewelry: any

  @ManyToOne(() => JewelryAttribute, { nullable: false })
  attribute: JewelryAttribute

  @ManyToOne(() => Skill, { nullable: true })
  skill: Skill
}

(globalThis as any).JewelryInstanceAttribute = JewelryInstanceAttribute
