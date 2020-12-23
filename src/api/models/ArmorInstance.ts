import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { ArmorClass } from "./ArmorClass"
import { ArmorInstanceAttribute } from "./ArmorInstanceAttribute"
import { ArmorInstanceDamageReduction } from "./ArmorInstanceDamageReduction"
import { ArmorLocation } from "./ArmorLocation"
import { Inventory } from "./Inventory"

@Entity()
export class ArmorInstance extends EntityBase{
    @Column() equipped: boolean
    @Column() damaged: boolean

    @ManyToOne(() => ArmorClass)
    armorClass: ArmorClass

    @ManyToOne(() => ArmorLocation)
    location: ArmorLocation

    @OneToMany(() => ArmorInstanceAttribute, aia => aia.armor)
    attributes: ArmorInstanceAttribute[]

    @ManyToOne(() => Inventory,i=>i.armor)
    inventory: Inventory

    @OneToMany(()=> ArmorInstanceDamageReduction, aidr=>aidr.armor)
    reductions: ArmorInstanceDamageReduction[]
    
}