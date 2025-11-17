import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"

@Entity()
export class MaterialType extends BaseEntity {
  @Column() name: string
}

(globalThis as any).MaterialType = MaterialType
