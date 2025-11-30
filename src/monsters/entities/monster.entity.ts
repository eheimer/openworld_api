import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { DamageType } from "../../damage-types/entities/damage-type.entity"
// avoid importing MonsterAction at module-load time; use entityRegistry in decorators
import { SlayerType } from "../../damage-types/entities/slayer-type.entity"
import { getEntity, registerEntity } from "../../entityRegistry"

@Entity()
export class Monster extends BaseEntity {
  @Column({ nullable: false }) name: string
  @Column({ type: 'text' }) hoverStats: string
  @Column({ nullable: false }) karma: string
  @Column({ nullable: false }) gold: string
  @Column({ nullable: false }) alignment: string
  @Column({ nullable: false }) hp: string
  @Column({ nullable: false }) bard: string
  @Column({ nullable: false }) taming: string
  @Column({ nullable: false }) resistF: string
  @Column({ nullable: false }) resistC: string
  @Column({ nullable: false }) resistP: string
  @Column({ nullable: false }) resistE: string
  @Column({ nullable: false }) resistPh: string
  @Column({ nullable: false }) magery: string
  @Column({ nullable: false }) evalInt: string
  @Column({ nullable: false }) aggroPriority: number
  @Column({ nullable: false }) tactics: string
  @Column({ nullable: false }) resistSpell: string
  @Column({ nullable: false }) anatomy: string
  @Column({ nullable: false }) strength: string
  @Column({ nullable: false }) dexterity: string
  @Column({ nullable: false }) intelligence: string
  @Column({ nullable: false }) baseDmg: string
  @Column({ nullable: false }) preferredFood: string
  @Column({ nullable: false }) controlSlots: number
  @Column({ type: 'text' }) specials: string
  @Column({ nullable: false }) animate: boolean
  @Column({ nullable: false }) packInstinct: string
  @Column({ nullable: false, default: '' }) tracking: string

  @OneToMany(() => getEntity('MonsterAction') as any, (ma) => (ma as any).monster)
  actions: any[]

  @ManyToOne(() => DamageType)
  damageType: DamageType

  @ManyToOne(() => DamageType)
  breathDmgType: DamageType

  @ManyToMany(() => SlayerType, (st) => st.monsters)
  @JoinTable()
  slayers: SlayerType[]

  // @OneToMany(() => MonsterClue, (mc) => mc.monster)
  // clues: MonsterClue[]
}

registerEntity('Monster', Monster)
