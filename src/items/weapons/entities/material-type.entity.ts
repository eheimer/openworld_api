import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { registerEntity } from "../../../entityRegistry.js"

@Entity()
export class MaterialType extends BaseEntity {
  @Column() name: string
}

registerEntity('MaterialType', MaterialType)
