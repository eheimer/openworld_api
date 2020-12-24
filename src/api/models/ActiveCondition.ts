import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne } from "typeorm"
import { Character } from "./Character"
import { Condition } from "./Condition"
import { CreatureInstance } from "./CreatureInstance"

@Entity()
export class ActiveCondition extends EntityBase{
    @Column() roundsRemaining: number
    @Column() cooldownRemaining: number
    @Column() damage: number

    @ManyToOne(()=> Condition)
    condition: Condition

    @ManyToOne(()=>CreatureInstance, ci=>ci.conditions)
    creature: CreatureInstance

    @ManyToOne(()=>Character, character=>character.conditions)
    character: Character

    @ManyToOne(()=>CreatureInstance)
    target: CreatureInstance


}