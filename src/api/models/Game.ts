import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import User from "./User"
import { Battle } from "./Battle"
import { Character } from "./Character"

@Entity()
export class Game extends EntityBase{
    @Column({ nullable: false })
    name: string

    @Column()
    maxPlayers: number

    @ManyToOne(type=> User)
    owner: User

    @ManyToMany(() => User, user => user.games)
    players: User[]

    @OneToMany(() => Character, character => character.game)
    characters: Character[]
    
    @OneToMany(()=> Battle,battle=> battle.game)
    battles: Battle[]
    
}