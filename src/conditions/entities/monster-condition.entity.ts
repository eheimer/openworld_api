import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from "../../common/ActiveCondition.js"

@Entity()
export class MonsterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => (globalThis as any).MonsterInstance, (ci) => (ci as any).conditions)
  creature: any
}

(globalThis as any).MonsterCondition = MonsterCondition
