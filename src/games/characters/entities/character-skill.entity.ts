import { Skill } from "../../../skills/entities/skill.entity"
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class CharacterSkill extends BaseEntity {
  @Column({ default: 1 }) level: number

  @ManyToOne(() => getEntity('Character') as any, (character) => (character as any).skills, { nullable: false })
  character: any

  @ManyToOne(() => Skill, { nullable: false })
  @JoinColumn()
  skill: Skill
}

// register this constructor in the explicit runtime registry
registerEntity('CharacterSkill', CharacterSkill)
