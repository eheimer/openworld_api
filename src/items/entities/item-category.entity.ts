import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { getEntity, registerEntity } from "../../entityRegistry"

@Entity()
export class ItemCategory extends BaseEntity {
  @Column()
  name: string
}

registerEntity('ItemCategory', ItemCategory)
