import { Entity, ManyToOne } from 'typeorm'
import { IsNotEmpty } from 'class-validator'
import { ActiveCondition } from "../../common/ActiveCondition.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Entity()
export class MonsterCondition extends ActiveCondition {
  @IsNotEmpty()
  @ManyToOne(() => getEntity('MonsterInstance') as any, (ci) => (ci as any).conditions)
  creature: any
}

registerEntity('MonsterCondition', MonsterCondition)
