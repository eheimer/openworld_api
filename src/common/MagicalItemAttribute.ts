import { Column } from 'typeorm'
import { BaseEntity } from "./BaseEntity"

export class MagicalItemAttribute extends BaseEntity {
  @Column() name: string
  @Column() value: string
}

