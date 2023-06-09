import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { Character } from '../../characters/entities/character.entity'
import { Monster } from './monster.entity'
import { MonsterCondition } from '../../conditions/entities/monster-condition.entity'
import { DamageType } from '../../damage-types/entities/damage-type.entity'
import { MonsterAction } from './monster-action.entity'
import { Battle } from '../../games/battles/entities/battle.entity'
import { Inventory } from '../../items/entities/inventory.entity'

@Entity()
export class MonsterInstance extends BaseEntity {
  @Column({ nullable: false }) name: string
  @Column({ nullable: false }) orighp: number
  @Column({ nullable: false }) hp: number
  @Column({ nullable: false }) magery: number
  @Column({ nullable: false }) evalInt: number
  @Column({ nullable: false }) tactics: number
  @Column({ nullable: false }) resistSpell: number
  @Column({ nullable: false }) anatomy: number
  @Column({ nullable: false }) strength: number
  @Column({ nullable: false }) dexterity: number
  @Column({ nullable: false }) intelligence: number
  @Column({ nullable: false }) baseDmg: string
  @Column({ nullable: false, default: false }) tamed: boolean
  @Column({ nullable: false }) hoverStats: string
  @Column({ nullable: false }) specials: string
  @Column({ nullable: true }) animate: boolean
  @Column({ nullable: true }) counter: number
  @Column({ nullable: true }) meleeDmg: number
  @Column({ nullable: true }) tameName: string
  @Column({ nullable: false }) stomach: number
  @Column({ nullable: false }) appetite: number
  @Column({ nullable: false }) obedience: number
  @Column({ nullable: false }) tracking: number
  @Column({ nullable: false }) resistPh: number
  @Column({ nullable: false }) resistC: number
  @Column({ nullable: false }) resistE: number
  @Column({ nullable: false }) resistF: number
  @Column({ nullable: false }) resistP: number

  @ManyToOne(() => Battle, (battle) => battle.enemies, { nullable: true })
  battleAsEnemy: Battle

  @ManyToOne(() => Battle, (battle) => battle.friendlies, { nullable: true })
  battleAsFriendly: Battle

  @ManyToOne(() => Character, (character) => character.pets, { nullable: true, onDelete: 'CASCADE' })
  owner: Character

  @ManyToOne(() => Monster, { nullable: false })
  monster: Monster

  @ManyToOne(() => MonsterAction, { nullable: true })
  nextAction: MonsterAction

  @OneToMany(() => MonsterCondition, (ac) => ac.creature, { nullable: true })
  conditions: MonsterCondition[]

  @OneToOne(() => Inventory, { nullable: true })
  @JoinColumn()
  loot: Inventory
}
