import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { Player } from '../../players/entities/player.entity'
// import { ArrayNotEmpty } from 'class-validator'
import { Character } from '../../characters/entities/character.entity'

/**
 * @description Represents a real person with login credentials for the game
 */
@Entity()
export class Game extends BaseEntity {
  @Column({ nullable: false, unique: true }) name: string

  @ManyToOne(() => Player, { nullable: false })
  owner: Player

  //@ArrayNotEmpty() //TODO: move validation decorator to the dto
  @ManyToMany(() => Player, (player) => player.games, { nullable: false, cascade: ['remove'] })
  players: Player[]

  @OneToMany(() => Character, (character) => character.game, { nullable: true })
  characters: Character[]

  // @OneToMany(() => Battle, (battle) => battle.game, { nullable: true })
  // battles: Battle[]
}
