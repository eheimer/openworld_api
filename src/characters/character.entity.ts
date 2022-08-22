import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { Player } from '../players/player.entity'
// import { ArrayNotEmpty } from 'class-validator'
import { Game } from '../games/game.entity'

/**
 * @description Represents a real person with login credentials for the game
 */
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

  @ManyToOne(() => Game, { nullable: false })
  game: Game

  @ManyToOne(() => Player, (player) => player.characters, { nullable: false })
  player: Player
}
