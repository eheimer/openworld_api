import { ArrayNotEmpty } from 'class-validator'
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm'

import { EntityBase } from '../../utils/entities/EntityBase'
import { Battle } from './Battle'
import { Character } from './Character'
import User from './User'

@Entity()
export class Game extends EntityBase {
  @Column({ nullable: false })
  name: string

  @Column()
  maxPlayers: number

  @ManyToOne(() => User, { nullable: false })
  owner: User

  @ArrayNotEmpty()
  @ManyToMany(() => User, (user) => user.games, { nullable: false })
  players: User[]

  @OneToMany(() => Character, (character) => character.game, { nullable: true })
  characters: Character[]

  @OneToMany(() => Battle, (battle) => battle.game, { nullable: true })
  battles: Battle[]
}

export default Game
