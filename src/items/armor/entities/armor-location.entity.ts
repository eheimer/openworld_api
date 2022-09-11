import { Column, Entity, JoinColumn, OneToOne } from 'typeorm'
import { EquipLocation } from '../../entities/equip-location.entity'
import { BaseEntity } from '../../../common/BaseEntity'

@Entity()
export class ArmorLocation extends BaseEntity {
  @Column() name: string

  @OneToOne(() => EquipLocation)
  @JoinColumn()
  location: EquipLocation
}
