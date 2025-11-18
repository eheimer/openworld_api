import { DamageType } from "../../../damage-types/entities/damage-type.entity.js"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { ArmorAttribute } from "./armor-attribute.entity.js"
import type { ArmorInstance } from "./armor-instance.entity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

@Entity()
export class ArmorInstanceAttribute extends BaseEntity {
  @Column() value: number
  @ManyToOne(() => getEntity('ArmorInstance') as any, (a: any) => (a as any).attributes, { nullable: true })
  armor: ArmorInstance

  @ManyToOne(() => ArmorAttribute, { nullable: false })
  attribute: ArmorAttribute

  @ManyToOne(() => DamageType, { nullable: true })
  damageType: DamageType
}

registerEntity('ArmorInstanceAttribute', ArmorInstanceAttribute)
