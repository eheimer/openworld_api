import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'

@Entity()
export class EquipLocation extends BaseEntity {
  @Column() name: string
}
