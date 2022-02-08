import { Column, Entity, ManyToOne } from 'typeorm'

import MagicalItemAttribute from '../../utils/entities/MagicalItemAttribute'
import WeaponSkill from './WeaponSkill'

@Entity()
export default class WeaponAttribute extends MagicalItemAttribute {
  @Column() hand: number

  @ManyToOne(() => WeaponSkill)
  skill: WeaponSkill
}
