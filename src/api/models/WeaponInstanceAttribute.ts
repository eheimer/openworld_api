import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne } from "typeorm"
import { SlayerType } from "./SlayerType"
import { WeaponAttribute } from "./WeaponAttribute"
import { WeaponInstance } from "./WeaponInstance"

@Entity()
export class WeaponInstanceAttribute extends EntityBase{
    @Column() value: number

    @ManyToOne(() => WeaponInstance)
    weapon: WeaponInstance

    @ManyToOne(() => WeaponAttribute)
    attribute: WeaponAttribute

    @ManyToOne(() => SlayerType)
    slayer:SlayerType
}
