import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToOne, OneToMany } from "typeorm"
import { Action } from "./Action"
import { Monster } from "./Monster"

@Entity()
export class MonsterAction extends EntityBase{
    @Column() value: number
    @Column() description: string
    @Column() weight: number

    @ManyToOne(() => Monster)
    monster: Monster

    @ManyToOne(()=> Action)
    action: Action

}