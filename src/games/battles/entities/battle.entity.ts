import { IsNotEmpty } from 'class-validator'
import { Character } from '../../characters/entities/character.entity'
import { Game } from '../../entities/game.entity'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { MonsterInstance } from '../../../monsters/entities/monster-instance.entity'

@Entity()
export class Battle extends BaseEntity {
  @Column({ default: 1, nullable: false }) round: number

  @IsNotEmpty()
  @OneToMany(() => Character, (character) => character.battle, {
    nullable: false
  })
  participants: Character[]

  @OneToMany(() => MonsterInstance, (ci) => ci.battleAsEnemy, {
    nullable: true
  })
  enemies: MonsterInstance[]

  @OneToMany(() => MonsterInstance, (ci) => ci.battleAsFriendly, {
    nullable: true
  })
  friendlies: MonsterInstance[]

  @ManyToOne(() => Game, (game) => game.battles, { nullable: false })
  game: Game

  @ManyToOne(() => Character, { nullable: false })
  initiator: Character
}
