import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export class Skill extends EntityBase {
  @Column() name: string
  @Column({ nullable: true, type: 'text' }) description: string
  @Column() spellbook: boolean
}

export default Skill
