import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"

@Entity()
export class Skill extends BaseEntity {
  @Column() name: string
  @Column({ nullable: true, type: 'text' }) description: string
  @Column() spellbook: boolean
}

(globalThis as any).Skill = Skill
