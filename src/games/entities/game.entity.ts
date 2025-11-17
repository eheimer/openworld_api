import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
// runtime references are resolved via globalThis to avoid static import cycles

/**
 * @description Represents a real person with login credentials for the game
 */
@Entity()
export class Game extends BaseEntity {
  @Column({ nullable: false, unique: true }) name: string

  @ManyToOne(() => (globalThis as any).Player, { nullable: false })
  owner: any

  @ManyToMany(() => (globalThis as any).Player, (player) => (player as any).games, { nullable: false })
  players: any[]

  @OneToMany(() => (globalThis as any).Character, (character: any) => character.game, { nullable: true })
  characters: any[]

  @OneToMany(() => (globalThis as any).Battle, (battle) => (battle as any).game, { nullable: true })
  battles: any[]
}

(globalThis as any).Game = Game
