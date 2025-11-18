import { Skill } from "../../skills/entities/skill.entity.js"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import type { Race } from "./race.entity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Entity()
export class RaceSkill extends BaseEntity {
  @Column() level: number

  @ManyToOne(() => getEntity('Race') as any)
  race: any

  @ManyToOne(() => Skill)
  skill: Skill
}

registerEntity('RaceSkill', RaceSkill)
