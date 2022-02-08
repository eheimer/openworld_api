import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import Game from './Game'
import User from './User'
import Battle from './Battle'
import CreatureInstance from './CreatureInstance'
import ActiveCondition from './ActiveCondition'
import Inventory from './Inventory'

/**
 * @description the Character created by a User for a particular Game.  Each user can have only one per game.
 */
@Entity()
export class Character extends EntityBase {
  @Column() name: string
  @Column() maxHp: number
  @Column() hp: number
  @Column({ default: 0 }) dmgIncrease: number
  @Column({ default: 0 }) baseDmgIncrease: number
  @Column({ default: 0 }) spellDmgIncrease: number
  @Column({ default: 0 }) baseResist: number
  @Column({ default: 0 }) resistPh: number
  @Column({ default: 0 }) resistC: number
  @Column({ default: 0 }) resistF: number
  @Column({ default: 0 }) resistE: number
  @Column({ default: 0 }) resistP: number
  @Column({ default: 0 }) dePh: number
  @Column({ default: 0 }) deC: number
  @Column({ default: 0 }) deF: number
  @Column({ default: 0 }) deE: number
  @Column({ default: 0 }) deP: number

  @ManyToOne(() => Game, { nullable: false })
  game: Game

  @ManyToOne(() => User, (user) => user.characters, { nullable: false })
  player: User

  @ManyToMany(() => Battle, (battle) => battle.participants, { nullable: true })
  battles: Battle[]

  @OneToOne(() => Inventory, { nullable: false })
  @JoinColumn()
  inventory: Inventory

  @OneToMany(() => ActiveCondition, (ac) => ac.character, { nullable: true })
  conditions: ActiveCondition[]

  @OneToMany(() => CreatureInstance, (ci) => ci.owner, { nullable: true })
  pets: CreatureInstance[]
}

export default Character
