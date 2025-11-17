import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
// avoid importing RaceSkill at module-load time; use globalThis in decorators

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

  @OneToMany(() => (globalThis as any).RaceSkill, (rs) => (rs as any).race)
  skills: any[]
}

(globalThis as any).Race = Race
