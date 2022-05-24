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
  // when character is created, hp should be set to the calculated maxHp
  @Column({ default: 1 }) hp: number
  @Column({ default: 0 }) mana: number
  // maxHp and maxMana are based on stats
  @Column() strength: number
  @Column() dexterity: number
  @Column() intelligence: number
  // sleep = 1-24, when >= 17, maxMana drops to 75%, when >=20, maxMana drops to 50%, when >= 23, maxMana drops to 25%
  @Column({ default: 1 }) sleep: number
  // hunger = 1-24, when >= 17, maxHp drops to 75%, when >= 20, maxHp drops to 50%, when >= 23, maxHp drops to 25%
  @Column({ default: 1 }) hunger: number
  // stamina - maxStamina is a calculated value, this field is needed to track the current value
  @Column({ default: 1 }) stamina: number
  // these increase numbers are calculated from stats and skills
  // @Column({ default: 0 }) dmgIncrease: number
  // @Column({ default: 0 }) baseDmgIncrease: number
  // @Column({ default: 0 }) spellDmgIncrease: number
  // movement will be based on race, when races are implemented
  @Column() movement: number

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
