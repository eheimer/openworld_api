import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne } from 'typeorm'
import EquipLocation from './EquipLocation'

@Entity()
export default class JewelryLocation extends EntityBase {
  @Column() name: string

  @ManyToOne(() => EquipLocation)
  location: EquipLocation
}
