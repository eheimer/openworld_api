import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"

@Entity()
export class MaterialType extends BaseEntity {
  @Column() name: string
}

