import { IsEmail } from 'class-validator'
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'

import EntityBase from '../../utils/entities/EntityBase'
import Character from './Character'
import Game from './Game'

/**
 * @description represents a real person with login credentials for the game
 */
@Entity()
export class User extends EntityBase {
  @Column({ nullable: false })
  password: string

  @Column({ nullable: false, unique: true })
  @IsEmail()
  email: string

  @Column({ nullable: false })
  name: string

  @Column({ default: false })
  isAdmin: boolean

  /**
   * The last time the user successfully logged in
   */
  @Column({ nullable: true })
  lastSeenAt: Date

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

export default User
