import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
// avoid importing Player/Game/MonsterInstance at module-load time; use globalThis in decorators
import type { CharacterCondition } from "../../../conditions/entities/character-condition.entity.js"
// avoid importing Battle at module-load time; use globalThis in decorators
import { Race } from "../../../race/entities/race.entity.js"
import { Inventory } from "../../../items/entities/inventory.entity.js"
import type { CharacterSkill } from "./character-skill.entity.js"

@Entity()
export class Character extends BaseEntity {
  @Column({ nullable: false }) name: string
  @Column({ default: 1 }) hp: number
  @Column({ default: 0 }) mana: number
  @Column({ default: 1 }) strength: number
  @Column({ default: 1 }) dexterity: number
  @Column({ default: 1 }) intelligence: number
  @Column({ default: 1 }) sleep: number
  @Column({ default: 1 }) hunger: number
  @Column({ default: 1 }) stamina: number
  @Column({ default: true }) new: boolean

  @ManyToOne(() => Race)
  race: Race

  @ManyToOne(() => (globalThis as any).Game, { nullable: false })
  game: any

  @ManyToOne(() => (globalThis as any).Player, (player: any) => player.characters, { nullable: false })
  player: any

  @ManyToOne(() => (globalThis as any).Battle, (battle: any) => battle.participants, { nullable: true })
  battle: any

  @OneToOne(() => Inventory, { nullable: false, eager: false })
  @JoinColumn()
  inventory: Inventory

  @OneToMany(() => (globalThis as any).CharacterCondition, (ac: any) => ac.character, { nullable: true })
  @JoinColumn()
  conditions: any[]

  @OneToMany(() => (globalThis as any).MonsterInstance, (m: any) => m.owner, { nullable: true })
  @JoinColumn()
  pets: any[]

  @OneToMany(() => (globalThis as any).CharacterSkill, (cs: any) => cs.character, { nullable: true, cascade: true })
  @JoinColumn()
  skills: any[]
}

(globalThis as any).Character = Character
