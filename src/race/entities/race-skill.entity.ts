import { Skill } from "../../skills/entities/skill.entity.js"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import type { Race } from "./race.entity.js"

@Entity()
export class RaceSkill extends BaseEntity {
  @Column() level: number

  @ManyToOne(() => (globalThis as any).Race)
  race: any

  @ManyToOne(() => Skill)
  skill: Skill
}

(globalThis as any).RaceSkill = RaceSkill
