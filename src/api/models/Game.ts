import { EntityBase } from "../../utils/entities/EntityBase"
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from "typeorm"
import User from "./User"
import { Battle } from "./Battle"
import { Character } from "./Character"
import { ArrayNotEmpty } from "class-validator"

@Entity()
export class Game extends EntityBase{
    @Column({ nullable: false })
    name: string

    @Column()
    maxPlayers: number

    @ManyToOne(() => User,{nullable:false})
    owner: User

    @ArrayNotEmpty()
    @ManyToMany(() => User, user => user.games, {nullable: false})
    players: User[]

    @OneToMany(() => Character, character => character.game,{nullable: true})
    characters: Character[]
    
    @OneToMany(()=> Battle,battle=> battle.game,{nullable: true})
    battles: Battle[]
    
}

export default Game