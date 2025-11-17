import { Skill } from "../../../skills/entities/skill.entity.js"
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"

@Entity()
export class CharacterSkill extends BaseEntity {
  @Column({ default: 1 }) level: number

  @ManyToOne(() => (globalThis as any).Character, (character) => (character as any).skills, { nullable: false })
  character: any

  @ManyToOne(() => Skill, { nullable: false })
  @JoinColumn()
  skill: Skill
}

(globalThis as any).CharacterSkill = CharacterSkill
