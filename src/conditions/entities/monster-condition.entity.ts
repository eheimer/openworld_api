import { Entity, ManyToOne } from 'typeorm'
import { MonsterInstance } from '../../monsters/entities/monster-instance.entity'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from '../../common/ActiveCondition'

@Entity()
export class MonsterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => MonsterInstance, (ci) => ci.conditions)
  creature: MonsterInstance
}
