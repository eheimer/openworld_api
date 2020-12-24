import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity } from "typeorm"

@Entity()
export class Material extends EntityBase{
    @Column() name: string
    @Column() weaponDurability: number
    @Column() canSpawn: boolean
    @Column() base: string
}