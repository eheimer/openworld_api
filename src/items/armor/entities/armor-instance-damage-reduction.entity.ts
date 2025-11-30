import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import type { ArmorInstance } from "./armor-instance.entity"
import { DamageType } from "../../../damage-types/entities/damage-type.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class ArmorInstanceDamageReduction extends BaseEntity {
  @Column() name: string
  @Column() value: number

  @ManyToOne(() => getEntity('ArmorInstance') as any, (a: any) => (a as any).reductions)
  armor: ArmorInstance

  @ManyToOne(() => DamageType, { nullable: false })
  damageType: DamageType
}

registerEntity('ArmorInstanceDamageReduction', ArmorInstanceDamageReduction)
