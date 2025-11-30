import { IsNotEmpty } from 'class-validator'
// avoid importing Character at module-load time; use globalThis in decorators
import { Game } from "../../entities/game.entity"
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { getEntity, registerEntity } from "../../../entityRegistry"
// avoid importing MonsterInstance at module-load time; use globalThis in decorators

@Entity()
export class Battle extends BaseEntity {
  @Column({ default: 1, nullable: false }) round: number

  @IsNotEmpty()
  @OneToMany(() => getEntity('Character') as any, (character) => (character as any).battle, {
    nullable: false
  })
  participants: any[]

  @OneToMany(() => getEntity('MonsterInstance') as any, (ci: any) => ci.battleAsEnemy, {
    nullable: true,
    cascade: true
  })
  enemies: any[]

  @OneToMany(() => getEntity('MonsterInstance') as any, (ci: any) => ci.battleAsFriendly, {
    nullable: true,
    cascade: true
  })
  friendlies: any[]

  @ManyToOne(() => Game, (game) => game.battles, { nullable: false })
  game: Game

  @ManyToOne(() => getEntity('Character') as any, { nullable: false })
  initiator: any
}

registerEntity('Battle', Battle)
