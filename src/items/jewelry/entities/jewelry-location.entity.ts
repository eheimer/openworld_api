import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { EquipLocation } from "../../entities/equip-location.entity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"

@Entity()
export class JewelryLocation extends BaseEntity {
  @Column() name: string

  @OneToOne(() => EquipLocation)
  @JoinColumn()
  location: EquipLocation
}

registerEntity('JewelryLocation', JewelryLocation)
