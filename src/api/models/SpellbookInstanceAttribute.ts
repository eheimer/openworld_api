import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm"
import { Skill } from "./Skill"
import { SlayerType } from "./SlayerType"
import { SpellbookAttribute } from "./SpellbookAttribute"
import { SpellbookInstance } from "./SpellbookInstance"

@Entity()
export class SpellbookInstanceAttribute extends EntityBase{
    @Column() value: number
    
    @ManyToOne(() => SpellbookAttribute)
    attribute: SpellbookAttribute

    @ManyToOne(() => Skill)
    skill: Skill

    @ManyToOne(() => SlayerType)
    slayer: SlayerType

    @ManyToOne(()=>SpellbookInstance)
    spellbook: SpellbookInstance

}