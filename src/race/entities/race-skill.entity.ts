import { Skill } from "../../skills/entities/skill.entity"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import type { Race } from "./race.entity"
import { getEntity, registerEntity } from "../../entityRegistry"

@Entity()
export class RaceSkill extends BaseEntity {
  @Column() level: number

  @ManyToOne(() => getEntity('Race') as any)
  race: any

  @ManyToOne(() => Skill)
  skill: Skill
}

registerEntity('RaceSkill', RaceSkill)
