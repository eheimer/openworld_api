import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from '../../common/ActiveCondition'
import { MonsterInstance } from '../../monsters/entities/monster-instance.entity'

@Entity()
export class MonsterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => MonsterInstance, (ci) => ci.conditions)
  creature: MonsterInstance
}
