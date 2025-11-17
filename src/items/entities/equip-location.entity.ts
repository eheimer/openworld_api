import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"

@Entity()
export class EquipLocation extends BaseEntity {
  @Column() name: string
}

(globalThis as any).EquipLocation = EquipLocation
