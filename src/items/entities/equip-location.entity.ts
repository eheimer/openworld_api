import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Entity()
export class EquipLocation extends BaseEntity {
  @Column() name: string
}

registerEntity('EquipLocation', EquipLocation)
