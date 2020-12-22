import {BeforeInsert, BeforeUpdate, Column, Entity, Unique } from "typeorm";
import { EntityBase } from "../../utils/EntityBase"
import bcrypt from 'bcrypt'
import { IsEmail, IsDate } from 'class-validator'

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

    //one-to-many and many-to-many associations
}

export default User;