import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import Game from './Game'
import User from './User'
import Battle from './Battle'
import CreatureInstance from './CreatureInstance'
import ActiveCondition from './ActiveCondition'
import Inventory from './Inventory'
import CharacterSkill from './CharacterSkill'
import Race from './Race'

/**
 * @description the Character created by a User for a particular Game.  Each user can have only one per game.
 */
@Entity()
export class Character extends EntityBase {
  @Column() name: string
  @Column({ default: 1 }) hp: number
  @Column({ default: 0 }) mana: number
  @Column() strength: number
  @Column() dexterity: number
  @Column() intelligence: number
  @Column({ default: 1 }) sleep: number
  @Column({ default: 1 }) hunger: number
  @Column({ default: 1 }) stamina: number

  @ManyToOne(() => Race)
  race: Race

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
  @JoinColumn()
  conditions: ActiveCondition[]

  @OneToMany(() => CreatureInstance, (ci) => ci.owner, { nullable: true })
  @JoinColumn()
  pets: CreatureInstance[]

  @OneToMany(() => CharacterSkill, (cs) => cs.character, { nullable: true })
  @JoinColumn()
  skills: CharacterSkill[]
}

export default Character
