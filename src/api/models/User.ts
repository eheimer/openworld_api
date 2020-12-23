import {Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany} from "typeorm";
import { EntityBase } from "../../utils/entities/EntityBase"
import bcrypt from 'bcrypt'
import { IsEmail } from 'class-validator'
import { Game } from "./Game"
import { Character } from "./Character"

@Entity()
export class User extends EntityBase
{
    @Column({ nullable: false, name: 'password' })
    private _password: string;

    get password(): string {
        return this._password;
    }

    set password(password: string) {
        this._password = bcrypt.hashSync(password, 10);
    }

    @Column({ nullable: false, unique: true })
    @IsEmail()
    email: string;

    @Column({nullable: false})
    name: string;

    @Column({ default: false })
    isAdmin: boolean;

    @Column({nullable: true})
    lastSeenAt: Date;

    @ManyToMany(() => Game, game => game.players)
    @JoinTable()
    games: Game[]

    @ManyToOne(() => Game)
    currentGame: Game

    @OneToMany(() => Character, character => character.player )
    characters: Character[]

}

export default User;