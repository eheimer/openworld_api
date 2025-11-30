import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { getEntity, registerEntity } from "../../entityRegistry"
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

  @OneToMany(() => getEntity('RaceSkill') as any, (rs) => (rs as any).race)
  skills: any[]
}

registerEntity('Race', Race)
