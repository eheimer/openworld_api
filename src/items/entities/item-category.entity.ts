import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"

@Entity()
export class ItemCategory extends BaseEntity {
  @Column()
  name: string
}

(globalThis as any).ItemCategory = ItemCategory
