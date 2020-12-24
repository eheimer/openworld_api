import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity } from "typeorm"

@Entity()
export class WeaponSkill extends EntityBase{
    @Column() name: string
}