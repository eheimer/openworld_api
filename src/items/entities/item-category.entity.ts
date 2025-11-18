import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Entity()
export class ItemCategory extends BaseEntity {
  @Column()
  name: string
}

registerEntity('ItemCategory', ItemCategory)
