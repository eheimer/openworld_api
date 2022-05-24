import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, OneToMany } from 'typeorm'
import RaceSkill from './RaceSkill'

@Entity()
export class Race extends EntityBase {
  @Column() description: string
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

export default Race
