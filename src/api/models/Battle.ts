import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import { Character } from "./Character"
import { Game } from "./Game"
import { CreatureInstance } from "./CreatureInstance"

/**
 * @description container for battle participants
 */
@Entity()
export class Battle extends EntityBase{
    @Column() round: number

    @ManyToMany(() => Character, character => character.battles)
    participants: Character[]

    @OneToMany(()=> CreatureInstance, ci=>ci.battleAsEnemy)
    enemies: CreatureInstance[]

    @OneToMany(()=> CreatureInstance, ci=>ci.battleAsFriendly)
    friendlies: CreatureInstance[]

    @ManyToOne(() => Game, game => game.battles)
    game: Game

    @ManyToOne(() => Character)
    initiator: Character

}