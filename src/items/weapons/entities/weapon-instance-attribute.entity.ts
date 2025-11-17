import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { SlayerType } from "../../../damage-types/entities/slayer-type.entity.js"
import { WeaponAttribute } from "./weapon-attribute.entity.js"
import type { WeaponInstance } from "./weapon-instance.entity.js"

@Entity()
export class WeaponInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => (globalThis as any).WeaponInstance, (w: any) => (w as any).attributes, { nullable: true })
  weapon: any

  @ManyToOne(() => WeaponAttribute, { nullable: false })
  attribute: WeaponAttribute

  @ManyToOne(() => SlayerType, { nullable: true })
  slayer: SlayerType
}

(globalThis as any).WeaponInstanceAttribute = WeaponInstanceAttribute
