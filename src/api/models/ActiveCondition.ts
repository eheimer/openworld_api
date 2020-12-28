import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne } from "typeorm"
import { Character } from "./Character"
import { Condition } from "./Condition"
import { CreatureInstance } from "./CreatureInstance"
import { ArrayNotEmpty, IsEthereumAddress, IsNotEmpty, ValidateIf } from "class-validator"

/**
 * @description a Condition that is currently active on a CreatureInstance or Character
 */
@Entity()
export class ActiveCondition extends EntityBase{
    /**
     * number of rounds before this condition expires
     */
    @Column() roundsRemaining: number
    /**
     * If the condition has a delay, this will initially be set to the delay.  Each round,
     * this will count down to 0, when the condition will take effect.  After that
     * point, this will be reset to the cooldown each time it reaches 0 until the effect expires
     */
    @Column() cooldownRemaining: number

    @Column({nullable: true}) damage: number

    @ManyToOne(()=> Condition,{nullable: false})
    condition: Condition

    @ValidateIf(o => o.character == null)
    @IsNotEmpty()
    @ManyToOne(()=>CreatureInstance, ci=>ci.conditions)
    creature: CreatureInstance

    @ValidateIf(o => o.creature == null)
    @IsNotEmpty()
    @ManyToOne(()=>Character, character=>character.conditions)
    character: Character

    @ManyToOne(()=>CreatureInstance)
    target: CreatureInstance

}