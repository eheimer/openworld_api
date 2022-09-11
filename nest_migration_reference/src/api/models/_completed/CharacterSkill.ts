import EntityBase from '../../utils/entities/EntityBase'
import { Entity, ManyToOne, Column, JoinColumn } from 'typeorm'
import Skill from './Skill'
import Character from './Character'

@Entity()
export class CharacterSkill extends EntityBase {
  @Column({ default: 1 }) level: number

  @ManyToOne(() => Character, (character) => character.skills, { nullable: false, onDelete: 'CASCADE' })
  character: Character

  @ManyToOne(() => Skill, { nullable: false })
  @JoinColumn()
  skill: Skill
}

export default CharacterSkill
