import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { ArmorClass } from "./ArmorClass"
import { ArmorInstanceAttribute } from "./ArmorInstanceAttribute"
import { ArmorInstanceDamageReduction } from "./ArmorInstanceDamageReduction"
import { ArmorLocation } from "./ArmorLocation"
import { Inventory } from "./Inventory"

/**
 * @description an instance of Armor that exists somewhere
 */
@Entity()
export class ArmorInstance extends EntityBase{
    /**
     * whether or not this item is equipped
     * @TODO I don't think this belongs on the item.  It should be
     * a function of the Character whose Inventory contains it
     */
    @Column() equipped: boolean
    /**
     * whether or not this item is damaged
     */
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