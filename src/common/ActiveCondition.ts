import { Column, ManyToOne } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { MonsterInstance } from '../monsters/entities/monster-instance.entity'
import { Condition } from '../conditions/entities/condition.entity'

export abstract class ActiveCondition extends BaseEntity {
  /**
   * number of rounds before this condition expires
   */
  @Column() roundsRemaining: number
  /**
   * If the condition has a delay, this will initially be set to the delay.  Each round,
   * this will count down to 0, when the condition will take effect.  After that
   * point, this will be reset to the cooldown each time it reaches 0 until the effect expires
   */
  @Column() cooldownRemaining: number

  @Column({ nullable: true }) damage: number

  @ManyToOne(() => Condition, { nullable: false })
  condition: Condition

  @ManyToOne(() => MonsterInstance)
  target: MonsterInstance
}
