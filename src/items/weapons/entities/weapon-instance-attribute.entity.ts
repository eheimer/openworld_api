import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { SlayerType } from "../../../damage-types/entities/slayer-type.entity.js"
import { WeaponAttribute } from "./weapon-attribute.entity.js"
import type { WeaponInstance } from "./weapon-instance.entity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

@Entity()
export class WeaponInstanceAttribute extends BaseEntity {
  @Column() value: number

  @ManyToOne(() => getEntity('WeaponInstance') as any, (w: any) => (w as any).attributes, { nullable: true })
  weapon: WeaponInstance

  @ManyToOne(() => WeaponAttribute, { nullable: false })
  attribute: WeaponAttribute

  @ManyToOne(() => SlayerType, { nullable: true })
  slayer: SlayerType
}

registerEntity('WeaponInstanceAttribute', WeaponInstanceAttribute)
