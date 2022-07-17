import EntityBase from '../../utils/entities/EntityBase'
import { AfterLoad, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import Character from './Character'
import Game from './Game'
import CreatureInstance from './CreatureInstance'
import { IsNotEmpty } from 'class-validator'

/**
 * @description container for battle participants
 */
@Entity()
export class Battle extends EntityBase {
  @Column({ default: 1, nullable: false }) round: number

  @IsNotEmpty()
  @ManyToMany(() => Character, (character) => character.battles, {
    nullable: false
  })
  @JoinTable()
  participants: Character[]

  @OneToMany(() => CreatureInstance, (ci) => ci.battleAsEnemy, {
    nullable: true
  })
  enemies: CreatureInstance[]

  @OneToMany(() => CreatureInstance, (ci) => ci.battleAsFriendly, {
    nullable: true
  })
  friendlies: CreatureInstance[]

  @ManyToOne(() => Game, (game) => game.battles, { nullable: false })
  game: Game

  @ManyToOne(() => Character, { nullable: false })
  initiator: Character

  // After load is called after the entity loads during find() and similar
  @AfterLoad()
  setDisplayName = async () => {
    //convert createdAt to DisplayName
    this.displayName = this.createdAt.toUTCString()
  }

  displayName: string
}

export default Battle
