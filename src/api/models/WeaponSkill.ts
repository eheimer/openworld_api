import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export default class WeaponSkill extends EntityBase {
  @Column() name: string
}
