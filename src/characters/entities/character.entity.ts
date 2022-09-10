import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { Player } from '../../players/entities/player.entity'
// import { ArrayNotEmpty } from 'class-validator'
import { Game } from '../../games/entities/game.entity'
import { MonsterInstance } from '../../monsters/entities/monster-instance.entity'
import { CharacterCondition } from '../../conditions/entities/character-condition.entity'
import { Battle } from '../../battles/entities/battle.entity'

@Entity()
export class Character extends BaseEntity {
  @Column({ nullable: false }) name: string
  @Column({ default: 1 }) hp: number
  @Column({ default: 0 }) mana: number
  @Column() strength: number
  @Column() dexterity: number
  @Column() intelligence: number
  @Column({ default: 1 }) sleep: number
  @Column({ default: 1 }) hunger: number
  @Column({ default: 1 }) stamina: number

  // @ManyToOne(() => Race)
  // race: Race

  @ManyToOne(() => Game, { nullable: false })
  game: Game

  @ManyToOne(() => Player, (player) => player.characters, { nullable: false })
  player: Player

  @ManyToMany(() => Battle, (battle) => battle.participants, { nullable: true })
  battles: Battle[]

  // @OneToOne(() => Inventory, { nullable: false })
  // @JoinColumn()
  // inventory: Inventory

  @OneToMany(() => CharacterCondition, (ac) => ac.character, { nullable: true })
  @JoinColumn()
  conditions: CharacterCondition[]

  @OneToMany(() => MonsterInstance, (m) => m.owner, { nullable: true })
  @JoinColumn()
  pets: MonsterInstance[]

  // @OneToMany(() => CharacterSkill, (cs) => cs.character, { nullable: true })
  // @JoinColumn()
  // skills: CharacterSkill[]
}
