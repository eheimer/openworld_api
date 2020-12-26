import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import { EntityBase } from "../../utils/entities/EntityBase"
import bcrypt from 'bcrypt'
import { IsEmail } from 'class-validator'
import { Game } from "./Game"
import { Character } from "./Character"

/**
 * @description represents a real person with login credentials for the game
 */
@Entity()
export class User extends EntityBase
{
    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column({nullable: false})
    name: string;

    @Column({ default: false })
    isAdmin: boolean;

    /**
     * The last time the user successfully logged in
     */
    @Column({ nullable: true })
    lastSeenAt: Date;

    @ManyToMany(() => Game, game => game.players)
    @JoinTable()
    games: Game[]

    @ManyToOne(() => Game)
    currentGame: Game

    @OneToMany(() => Character, character => character.player )
    characters: Character[]

    updatePasswordHash(newPassword?: string) {
        if(newPassword){ this.password = newPassword}
        this.password = bcrypt.hashSync(this.password,10)
    }

}

export default User;