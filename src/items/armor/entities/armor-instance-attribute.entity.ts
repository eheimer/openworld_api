import { DamageType } from "../../../damage-types/entities/damage-type.entity"
import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { ArmorAttribute } from "./armor-attribute.entity"
import type { ArmorInstance } from "./armor-instance.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

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
