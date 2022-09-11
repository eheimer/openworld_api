import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'

@Entity()
export class WeaponSkill extends BaseEntity {
  @Column() name: string
}
