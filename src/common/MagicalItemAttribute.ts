import { Column } from 'typeorm'
import { BaseEntity } from "./BaseEntity.js"

export class MagicalItemAttribute extends BaseEntity {
  @Column() name: string
  @Column() value: string
}

(globalThis as any).MagicalItemAttribute = MagicalItemAttribute
