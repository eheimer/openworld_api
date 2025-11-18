import { Column } from 'typeorm'
import { BaseEntity } from "./BaseEntity.js"
import { getEntity, registerEntity } from "../entityRegistry.js"

export class MagicalItemAttribute extends BaseEntity {
  @Column() name: string
  @Column() value: string
}

registerEntity('MagicalItemAttribute', MagicalItemAttribute)
