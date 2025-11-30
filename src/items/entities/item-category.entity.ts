import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"

@Entity()
export class ItemCategory extends BaseEntity {
  @Column()
  name: string
}

