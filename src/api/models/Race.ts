import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, OneToMany } from 'typeorm'
import RaceSkill from './RaceSkill'

@Entity()
export class Race extends EntityBase {
  @Column() description: string
  @Column() movement: string
  @Column() hpReplenish: number
  @Column() manaReplenish: number
  @Column() staminaReplenish: number
  @Column() hunger: number
  @Column() sleep: number

  @OneToMany(() => RaceSkill, (rs) => rs.race)
  skills: RaceSkill[]
}

export default Race
