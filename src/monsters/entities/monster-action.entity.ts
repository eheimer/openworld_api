import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import { Monster } from "./monster.entity.js"
import { Action } from "./action.entity.js"

@Entity()
export class MonsterAction extends BaseEntity {
  @Column() value: number
  @Column({ type: 'text' }) description: string
  @Column() weight: number

  @ManyToOne(() => Monster)
  monster: Monster

  @ManyToOne(() => Action)
  action: Action
}

(globalThis as any).MonsterAction = MonsterAction
