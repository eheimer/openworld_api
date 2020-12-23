import {BeforeInsert, BeforeUpdate, CreateDateColumn, getRepository, PrimaryGeneratedColumn, UpdateDateColumn, } from "typeorm";
import { validate } from 'class-validator'
import logger from "./logger"

export class EntityBase {
    @PrimaryGeneratedColumn("uuid")
    id: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({})
    updatedAt: Date;

    @BeforeInsert()
    @BeforeUpdate()
    async validate() {
        const errors = await validate(this)
        if (errors.length > 0) {
            logger.error({errors})
            throw new Error('Validation failed!')
        }
    }
}