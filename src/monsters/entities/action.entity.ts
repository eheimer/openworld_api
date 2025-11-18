import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import { registerEntity } from "../../entityRegistry.js"

/**
 * @description a unique action available to a monster on its turn
 */
@Entity()
export class Action extends BaseEntity {
  @Column() name: string
  @Column({ nullable: true }) value: number
  @Column({ type: 'text' }) description: string
  @Column() initiative: number
  @Column() spellDmgRange: string //base damage min/max for spells
}

registerEntity('Action', Action)
