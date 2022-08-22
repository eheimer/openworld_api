import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { Game } from '../games/game.entity'
import { Character } from '../characters/character.entity'

/**
 * @description Represents a real person with login credentials for the game
 */
@Entity()
export class Player extends BaseEntity {
  @Column({ nullable: false, unique: true }) username: string
  @Column({ nullable: false }) password: string
  @Column({ nullable: false, unique: true }) email: string
  @Column({ default: false }) isAdmin: boolean
  @Column({ nullable: true }) lastSeenAt: Date

  @ManyToMany(() => Game, (game) => game.players, { nullable: true })
  @JoinTable()
  games: Game[]

  @ManyToOne(() => Game, { nullable: true })
  currentGame: Game

  @OneToMany(() => Character, (character) => character.player, {
    nullable: true
  })
  characters: Character[]
}
