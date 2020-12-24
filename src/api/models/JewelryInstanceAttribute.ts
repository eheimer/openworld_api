import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { JewelryAttribute } from "./JewelryAttribute"
import { JewelryInstance } from "./JewelryInstance"
import { Skill } from "./Skill"

@Entity()
export class JewelryInstanceAttribute extends EntityBase{
    @Column() value: number

    @ManyToOne(()=>JewelryInstance,ji=>ji.attributes)
    jewelry: JewelryInstance

    @ManyToOne(() => JewelryAttribute)
    attribute: JewelryAttribute

    @ManyToOne(() => Skill)
    skill: Skill
}