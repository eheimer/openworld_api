import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"
// runtime references are resolved via globalThis to avoid static import cycles

/**
 * @description Represents a real person with login credentials for the game
 */
@Entity()
export class Game extends BaseEntity {
  @Column({ nullable: false, unique: true }) name: string

  @ManyToOne(() => getEntity('Player') as any, { nullable: false })
  owner: any

  @ManyToMany(() => getEntity('Player') as any, (player) => (player as any).games, { nullable: false })
  players: any[]

  @OneToMany(() => getEntity('Character') as any, (character: any) => character.game, { nullable: true })
  characters: any[]

  @OneToMany(() => getEntity('Battle') as any, (battle) => (battle as any).game, { nullable: true })
  battles: any[]
}

registerEntity('Game', Game)
