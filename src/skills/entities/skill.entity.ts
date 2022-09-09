import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'

@Entity()
export class Skill extends BaseEntity {
  @Column() name: string
  @Column({ nullable: true, type: 'text' }) description: string
  @Column() spellbook: boolean
}
