import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { EquipLocation } from "../../entities/equip-location.entity.js"
import { BaseEntity } from "../../../common/BaseEntity.js"
import { registerEntity } from "../../../entityRegistry.js"

@Entity()
export class ArmorLocation extends BaseEntity {
  @Column() name: string

  @OneToOne(() => EquipLocation)
  @JoinColumn()
  location: EquipLocation
}

registerEntity('ArmorLocation', ArmorLocation)
