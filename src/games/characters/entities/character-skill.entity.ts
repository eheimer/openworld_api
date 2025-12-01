import { Skill } from '../../../skills/entities/skill.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { Character } from './character.entity'

@Entity()
export class CharacterSkill extends BaseEntity {
  @Column({ default: 1 }) level: number

  @ManyToOne(() => Character, (character) => character.skills, { nullable: false, onDelete: 'CASCADE' })
  character: Character

  @ManyToOne(() => Skill, { nullable: false })
  @JoinColumn()
  skill: Skill
}
