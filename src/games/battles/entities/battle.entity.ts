import { IsNotEmpty } from 'class-validator'
// avoid importing Character at module-load time; use globalThis in decorators
import { Game } from "../../entities/game.entity.js"
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
// avoid importing MonsterInstance at module-load time; use globalThis in decorators

@Entity()
export class Battle extends BaseEntity {
  @Column({ default: 1, nullable: false }) round: number

  @IsNotEmpty()
  @OneToMany(() => (globalThis as any).Character, (character) => (character as any).battle, {
    nullable: false
  })
  participants: any[]

  @OneToMany(() => (globalThis as any).MonsterInstance, (ci: any) => ci.battleAsEnemy, {
    nullable: true,
    cascade: true
  })
  enemies: any[]

  @OneToMany(() => (globalThis as any).MonsterInstance, (ci: any) => ci.battleAsFriendly, {
    nullable: true,
    cascade: true
  })
  friendlies: any[]

  @ManyToOne(() => Game, (game) => game.battles, { nullable: false })
  game: Game

  @ManyToOne(() => (globalThis as any).Character, { nullable: false })
  initiator: any
}

(globalThis as any).Battle = Battle
