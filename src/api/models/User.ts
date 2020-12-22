import {Column, Entity } from "typeorm";
import { EntityBase } from "../../utils/EntityBase"

@Entity()
export class User extends EntityBase
{
    @Column({nullable: false})
    password: string;

    @Column({nullable: false})
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