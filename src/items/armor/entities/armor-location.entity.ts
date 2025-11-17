import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { EquipLocation } from "../../entities/equip-location.entity.js"
import { BaseEntity } from "../../../common/BaseEntity.js"

@Entity()
export class ArmorLocation extends BaseEntity {
  @Column() name: string

  @OneToOne(() => EquipLocation)
  @JoinColumn()
  location: EquipLocation
}

(globalThis as any).ArmorLocation = ArmorLocation
