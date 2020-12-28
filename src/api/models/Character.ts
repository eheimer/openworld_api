import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { Game } from "./Game"
import User from "./User"
import { Battle } from "./Battle"
import { CreatureInstance } from "./CreatureInstance"
import { ActiveCondition } from "./ActiveCondition"
import { Inventory } from "./Inventory"

/**
 * @description the Character created by a User for a particular Game.  Each user can have only one per game.
 */
@Entity()
export class Character extends EntityBase{
    @Column() name: string
    @Column() maxHp: number
    @Column() hp: number
    @Column() dmgIncrease: number
    @Column() baseDmgIncrease: number
    @Column() spellDmgIncrease: number
    @Column() baseResist: number
    @Column() resistPh: number
    @Column() resistC: number
    @Column() resistF: number
    @Column() resistE: number
    @Column() resistP: number
    @Column() dePh: number
    @Column() deC: number
    @Column() deF: number
    @Column() deE: number
    @Column() deP: number 

    @ManyToOne(()=> Game,{nullable:false})
    game: Game

    @ManyToOne(() => User, user => user.characters,{nullable: false})
    player: User

    @ManyToMany(()=> Battle, battle => battle.participants,{nullable: true})
    battles: Battle[]

    @OneToOne(()=>Inventory,{nullable: false})
    @JoinColumn()
    inventory: Inventory

    @OneToMany(()=>ActiveCondition, ac=>ac.character, {nullable:true})
    conditions: ActiveCondition[]

    @OneToMany(()=>CreatureInstance, ci=>ci.owner, {nullable:true})
    pets: CreatureInstance[]

}