import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { Monster } from "./monster.entity"
import { Action } from "./action.entity"
import { registerEntity } from "../../entityRegistry"

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

registerEntity('MonsterAction', MonsterAction)
