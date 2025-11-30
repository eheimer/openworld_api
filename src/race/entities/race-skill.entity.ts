import { Skill } from '../../skills/entities/skill.entity'
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { Race } from './race.entity'

@Entity()
export class RaceSkill extends BaseEntity {
  @Column() level: number

  @ManyToOne(() => Race)
  race: Race

  @ManyToOne(() => Skill)
  skill: Skill
}
