import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { EquipLocation } from './equip-location.entity'

@Entity()
export class JewelryLocation extends BaseEntity {
  @Column() name: string

  @ManyToOne(() => EquipLocation)
  location: EquipLocation
}
