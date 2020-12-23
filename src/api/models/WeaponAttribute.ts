import { EntityBase } from "../../utils/entities/EntityBase"
import { MagicalItemAttribute } from "../../utils/entities/MagicalItemAttribute"
import { Column, Entity, ManyToOne } from "typeorm"
import { WeaponSkill } from "./WeaponSkill"

@Entity()
export class WeaponAttribute extends MagicalItemAttribute {
    @Column() hand: number
    
    @ManyToOne(() => WeaponSkill)
    skill: WeaponSkill
}