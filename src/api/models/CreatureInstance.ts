import { EntityBase } from '../../utils/entities/EntityBase'
import { iResistHaver } from '../../utils/entities/iResistHaver'
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { ActiveCondition } from './ActiveCondition'
import { Battle } from './Battle'
import { Character } from './Character'
import { DamageType } from './DamageType'
import { Inventory } from './Inventory'
import { Monster } from './Monster'
import { MonsterAction } from './MonsterAction'

@Entity()
export class CreatureInstance extends EntityBase implements iResistHaver {
  @Column() name: string
  @Column() orighp: number
  @Column() hp: number
  @Column() magery: number
  @Column() evalInt: number
  @Column() tactics: number
  @Column() resistSpell: number
  @Column() anatomy: number
  @Column() strength: number
  @Column() dexterity: number
  @Column() intelligence: number
  @Column() baseDmg: string
  @Column() initiative: number
  @Column() tamed: boolean
  @Column() actionName: string
  @Column() actionValue: number
  @Column() actionDescription: string
  @Column() actionDmgAmount: number
  @Column() hoverStats: string
  @Column() specials: string
  @Column() animate: boolean
  @Column() counter: number
  @Column() meleeDmg: number
  @Column() tameName: string
  @Column() stomach: number
  @Column() appetite: number
  @Column() obedience: number
  @Column() tracking: number
  @Column() resistPh: number
  @Column() resistC: number
  @Column() resistE: number
  @Column() resistF: number
  @Column() resistP: number

  @ManyToOne(() => Battle, (battle) => battle.enemies, { nullable: true })
  battleAsEnemy: Battle

  @ManyToOne(() => Battle, (battle) => battle.friendlies, { nullable: true })
  battleAsFriendly: Battle

  @ManyToOne(() => Character, (character) => character.pets, { nullable: true })
  owner: Character

  @ManyToOne(() => Monster, { nullable: false })
  monster: Monster

  @ManyToOne(() => MonsterAction, { nullable: true })
  nextAction: MonsterAction

  @OneToMany(() => ActiveCondition, (ac) => ac.creature, { nullable: true })
  conditions: ActiveCondition[]

  @ManyToOne(() => DamageType, { nullable: true })
  actionDamageType: DamageType

  @OneToOne(() => Inventory, { nullable: true })
  @JoinColumn()
  loot: Inventory
}
