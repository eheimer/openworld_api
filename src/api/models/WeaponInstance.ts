import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { Inventory } from "./Inventory"
import { Material } from "./Material"
import { Weapon } from "./Weapon"
import { WeaponInstanceAttribute } from "./WeaponInstanceAttribute"

@Entity()
export class WeaponInstance extends EntityBase{
    @Column() equipped: boolean
    @Column() damaged: boolean

    @ManyToOne(() => Weapon)
    weapon: Weapon

    @OneToMany(() => WeaponInstanceAttribute, wia=>wia.weapon)
    attributes: WeaponInstanceAttribute[]

    @ManyToOne(() => Material)
    material: Material

    @ManyToOne(()=>Inventory,i=>i.weapons)
    inventory: Inventory
}