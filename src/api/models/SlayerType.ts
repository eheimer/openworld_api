import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToMany, OneToMany } from "typeorm"
import { Monster } from "./Monster"

@Entity()
export class SlayerType extends EntityBase{
    @Column() name: string

    @ManyToMany(() => Monster, monster => monster.slayers)
    monsters: Monster[]
}