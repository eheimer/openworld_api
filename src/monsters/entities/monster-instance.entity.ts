import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import type { Character } from "../../games/characters/entities/character.entity"
import { Monster } from "./monster.entity"
import type { MonsterCondition } from "../../conditions/entities/monster-condition.entity"
import { MonsterAction } from "./monster-action.entity"
import type { Battle } from "../../games/battles/entities/battle.entity"
import { Inventory } from "../../items/entities/inventory.entity"
import { getEntity, registerEntity } from "../../entityRegistry"

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
  @Column({ nullable: false }) baseDmg: number
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

  @ManyToOne(() => getEntity('Battle') as any, (battle: any) => battle.enemies, { nullable: true })
  battleAsEnemy: any

  // we don't want friendlies to be deleted when a battle is deleted, or people will lose their pets
  @ManyToOne(() => getEntity('Battle') as any, (battle: any) => battle.friendlies, { nullable: true })
  battleAsFriendly: any

  @ManyToOne(() => getEntity('Character') as any, (character: any) => character.pets, { nullable: true })
  owner: any

  @ManyToOne(() => Monster, { nullable: false })
  monster: Monster

  @ManyToOne(() => MonsterAction, { nullable: true })
  nextAction: MonsterAction

  @OneToMany(() => getEntity('MonsterCondition') as any, (ac: any) => ac.creature, { nullable: true })
  conditions: any[]

  @OneToOne(() => Inventory, { nullable: true })
  @JoinColumn()
  loot: Inventory
}

registerEntity('MonsterInstance', MonsterInstance)
