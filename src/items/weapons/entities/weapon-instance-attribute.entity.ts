import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { SlayerType } from "../../../damage-types/entities/slayer-type.entity"
import { WeaponAttribute } from "./weapon-attribute.entity"
import type { WeaponInstance } from "./weapon-instance.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

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
