import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity } from "typeorm"

@Entity()
export class Action extends EntityBase{
    @Column() name: string
    @Column() value: number
    @Column() description: string
    @Column() initiative: number
    @Column() spellDmgRange: string
}