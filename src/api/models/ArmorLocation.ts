import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne } from "typeorm"
import { EquipLocation } from "./EquipLocation"

/**
 * @description location that Armor can be equipped
 */
@Entity()
export class ArmorLocation extends EntityBase{
    @Column() name: string

    @ManyToOne(()=>EquipLocation)
    location: EquipLocation
}