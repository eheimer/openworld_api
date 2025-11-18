import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import type { ArmorInstance } from "./armor-instance.entity.js"
import { DamageType } from "../../../damage-types/entities/damage-type.entity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

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
