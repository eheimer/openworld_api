import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import type { ArmorInstance } from "./armor-instance.entity.js"
import { DamageType } from "../../../damage-types/entities/damage-type.entity.js"

@Entity()
export class ArmorInstanceDamageReduction extends BaseEntity {
  @Column() name: string
  @Column() value: number

  @ManyToOne(() => (globalThis as any).ArmorInstance, (a: any) => (a as any).reductions)
  armor: any

  @ManyToOne(() => DamageType, { nullable: false })
  damageType: DamageType
}

(globalThis as any).ArmorInstanceDamageReduction = ArmorInstanceDamageReduction
