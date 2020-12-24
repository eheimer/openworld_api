import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne } from "typeorm"
import { ClassDamageReduction } from "./ClassDamageReduction"

/**
 * @description a property of Armor that affects durability and damage reduction
 */
@Entity()
export class ArmorClass extends EntityBase{
    @Column() name: string
    @Column() durability: number

    @ManyToOne(() => ClassDamageReduction, cdr => cdr.armorClass)
    reductions: ClassDamageReduction[]
}