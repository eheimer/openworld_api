import { Column } from 'typeorm'
import { BaseEntity } from "./BaseEntity"
import { getEntity, registerEntity } from "../entityRegistry"

export class MagicalItemAttribute extends BaseEntity {
  @Column() name: string
  @Column() value: string
}

registerEntity('MagicalItemAttribute', MagicalItemAttribute)
