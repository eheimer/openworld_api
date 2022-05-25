import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export class Skill extends EntityBase {
  @Column() name: string
  @Column({ nullable: true, type: 'text', length: 65535 }) description: string
  @Column() spellbook: boolean
}

export default Skill
