import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import { DamageType } from "./DamageType"
import { MonsterAction } from "./MonsterAction"
import { MonsterClue } from "./MonsterClue"
import { SlayerType } from "./SlayerType"

@Entity()
export class Monster extends EntityBase{
    @Column() name: string
    @Column() hoverStats: string
    @Column() karma: string
    @Column() gold: string
    @Column() alignment: string
    @Column() hp: string
    @Column() bard: string
    @Column() taming: string
    @Column() resistF: string
    @Column() resistC: string
    @Column() resistP: string
    @Column() resistE: string
    @Column() resistPh: string
    @Column() magery: string
    @Column() evalInt: string
    @Column() aggroPriority: number
    @Column() tactics: string
    @Column() resistSpell: string
    @Column() anatomy: string
    @Column() strength: string
    @Column() dexterity: string
    @Column() intelligence: string
    @Column() baseDmg: string
    @Column() preferredFood: string
    @Column() controlSlots: number
    @Column() specials: string
    @Column() animate: boolean
    @Column() packInstinct: string
    @Column() tracking: string

    @OneToMany(()=>MonsterAction, ma => ma.monster)
    actions: MonsterAction[]

    @ManyToOne(()=>DamageType)
    damageType: DamageType

    @ManyToOne(()=>DamageType)
    breathDmgType: DamageType

    @ManyToMany(()=>SlayerType,st=>st.monsters)
    slayers: SlayerType[]

    @OneToMany(()=>MonsterClue, mc=>mc.monster)
    clues: MonsterClue[]
}