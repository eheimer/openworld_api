import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { EquipLocation } from '../../entities/equip-location.entity'

@Entity()
export class JewelryLocation extends BaseEntity {
  @Column() name: string

  @OneToOne(() => EquipLocation)
  @JoinColumn()
  location: EquipLocation
}
