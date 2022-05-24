import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne } from 'typeorm'
import Race from './Race'
import Skill from './Skill'

@Entity()
export class RaceSkill extends EntityBase {
  @Column() level: number

  @ManyToOne(() => Race)
  race: Race

  @ManyToOne(() => Skill)
  category: Skill
}

export default RaceSkill
