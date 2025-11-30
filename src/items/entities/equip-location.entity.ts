import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { getEntity, registerEntity } from "../../entityRegistry"

@Entity()
export class EquipLocation extends BaseEntity {
  @Column() name: string
}

registerEntity('EquipLocation', EquipLocation)
