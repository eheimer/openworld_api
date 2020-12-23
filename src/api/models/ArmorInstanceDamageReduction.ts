import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne } from "typeorm"
import { ArmorInstance } from "./ArmorInstance"
import { DamageType } from "./DamageType"

@Entity()
export class ArmorInstanceDamageReduction extends EntityBase{
    @Column() name: string
    @Column() value: number
   
    @ManyToOne(()=>ArmorInstance)
    armor: ArmorInstance

    @ManyToOne(() => DamageType)
    damageType: DamageType
}
