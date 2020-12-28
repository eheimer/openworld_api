import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToMany, ManyToOne } from "typeorm"
import { Skill } from "./Skill"
import { SlayerType } from "./SlayerType"
import { SpellbookAttribute } from "./SpellbookAttribute"
import { SpellbookInstance } from "./SpellbookInstance"

@Entity()
export class SpellbookInstanceAttribute extends EntityBase{
    @Column() value: number
    
    @ManyToOne(() => SpellbookAttribute,{nullable: false})
    attribute: SpellbookAttribute

    @ManyToOne(() => Skill,{nullable: true})
    skill: Skill

    @ManyToOne(() => SlayerType,{nullable: true})
    slayer: SlayerType

    @ManyToOne(()=>SpellbookInstance,{nullable: true})
    spellbook: SpellbookInstance

}