import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Game } from "./Game"
import User from "./User"
import { Battle } from "./Battle"
import { iDamageEaterHaver} from "../../utils/entities/iDamageEaterHaver"
import { iResistHaver } from "../../utils/entities/iResistHaver"
import { CreatureInstance } from "./CreatureInstance"
import { ActiveCondition } from "./ActiveCondition"
import { Inventory } from "./Inventory"

@Entity()
export class Character extends EntityBase{
    @Column() name: string
    @Column() maxHp: number
    @Column() hp: number
    @Column() dmgIncrease: number
    @Column() baseDmgIncrease: number
    @Column() spellDmgIncrease: number
    @Column() baseResist: number
    
    //ResistHaver members
    @Column() resistPh: number
    @Column() resistC: number
    @Column() resistF: number
    @Column() resistE: number
    @Column() resistP: number

    //DamageEaterHaver members
    @Column() dePh: number
    @Column() deC: number
    @Column() deF: number
    @Column() deE: number
    @Column() deP: number 

    @ManyToOne(()=> Game)
    game: Game

    @ManyToOne(() => User, user => user.characters)
    player: User

    @ManyToMany(()=> Battle, battle => battle.participants)
    battles: Battle[]

    @OneToOne(()=>Inventory)
    inventory: Inventory

    @OneToMany(()=>ActiveCondition, ac=>ac.character)
    conditions: ActiveCondition[]

    @OneToMany(()=>CreatureInstance, ci=>ci.owner)
    pets: CreatureInstance[]

}