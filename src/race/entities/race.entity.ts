import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { RaceSkill } from './race-skill.entity'

@Entity()
export class Race extends BaseEntity {
  @Column({ type: 'text' }) description: string
  @Column() name: string
  @Column() movement: string
  @Column() hpReplenish: number
  @Column() manaReplenish: number
  @Column() staminaReplenish: number
  @Column({ nullable: true }) hunger: number
  @Column({ nullable: true }) sleep: number

  @OneToMany(() => RaceSkill, (rs) => rs.race)
  skills: RaceSkill[]
}
