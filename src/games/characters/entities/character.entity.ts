import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
// inverse-side imports kept as type-only where possible
import type { CharacterCondition } from "../../../conditions/entities/character-condition.entity"
import { Race } from "../../../race/entities/race.entity"
import { Inventory } from "../../../items/entities/inventory.entity"
import type { CharacterSkill } from "./character-skill.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class Character extends BaseEntity {
	@Column({ nullable: false }) name: string
	@Column({ default: 1 }) hp: number
	@Column({ default: 0 }) mana: number
	@Column({ default: 1 }) strength: number
	@Column({ default: 1 }) dexterity: number
	@Column({ default: 1 }) intelligence: number
	@Column({ default: 1 }) sleep: number
	@Column({ default: 1 }) hunger: number
	@Column({ default: 1 }) stamina: number
	@Column({ default: true }) new: boolean

	@ManyToOne(() => Race)
	race: Race

	@ManyToOne(() => getEntity('Game') as any, { nullable: false })
	game: any

	@ManyToOne(() => getEntity('Player') as any, (player: any) => player.characters, { nullable: false })
	player: any

	@ManyToOne(() => getEntity('Battle') as any, (battle: any) => battle.participants, { nullable: true })
	battle: any

	@OneToOne(() => Inventory, { nullable: false, eager: false })
	@JoinColumn()
	inventory: Inventory

	@OneToMany(() => getEntity('CharacterCondition') as any, (ac: any) => ac.character, { nullable: true })
	@JoinColumn()
	conditions: any[]

	@OneToMany(() => getEntity('MonsterInstance') as any, (m: any) => m.owner, { nullable: true })
	@JoinColumn()
	pets: any[]

	@OneToMany(() => getEntity('CharacterSkill') as any, (cs: any) => cs.character, { nullable: true, cascade: true })
	@JoinColumn()
	skills: any[]
}

registerEntity('Character', Character)
