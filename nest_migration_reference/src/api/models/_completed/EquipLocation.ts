import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export class EquipLocation extends EntityBase {
  @Column() name: string
}

export default EquipLocation