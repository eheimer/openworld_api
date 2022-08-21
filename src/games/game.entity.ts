import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm'
import { BaseEntity } from '../common/base.entity'
import { Player } from '../players/player.entity'
// import { ArrayNotEmpty } from 'class-validator'

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

  // @OneToMany(() => Character, (character) => character.game, { nullable: true })
  // characters: Character[]

  // @OneToMany(() => Battle, (battle) => battle.game, { nullable: true })
  // battles: Battle[]
}
