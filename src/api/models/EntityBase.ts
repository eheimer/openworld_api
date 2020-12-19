import {CreateDateColumn, getRepository, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";

export class EntityBase {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Convert the object to JSON
     */
    serialize (): string {
        return JSON.stringify(this);
    }
}