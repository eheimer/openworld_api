import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne } from "typeorm"
import { ArmorAttribute } from "./ArmorAttribute"
import { ArmorInstance } from "./ArmorInstance"
import { DamageType } from "./DamageType"

@Entity()
export class ArmorInstanceAttribute extends EntityBase{
    @Column() value: number

    @ManyToOne(()=>ArmorInstance)
    armor: ArmorInstance

    @ManyToOne(() => ArmorAttribute)
    attribute: ArmorAttribute

    @ManyToOne(() => DamageType)
    damageType: DamageType
}