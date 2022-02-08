import { BeforeInsert, BeforeUpdate, CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm'
import { validate } from 'class-validator'
import logger from '../logger'

export default abstract class EntityBase {
  @PrimaryGeneratedColumn('uuid')
  id: number | string

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn({})
  updatedAt: Date

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this)
    if (errors.length > 0) {
      logger.error({ errors })
      throw new Error('Validation failed!')
    }
  }
}
