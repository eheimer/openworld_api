import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne } from 'typeorm'
import MaterialType from './MaterialType'
import SpecialMove from './SpecialMove'
import WeaponSkill from './WeaponSkill'

@Entity()
export class Weapon extends EntityBase {
  @Column() name: string
  @Column() damage: string
  @Column() range: number
  @Column() speed: number
  @Column() strength: number
  @Column() hand: number

  @ManyToOne(() => WeaponSkill)
  skill: WeaponSkill

  @ManyToOne(() => SpecialMove)
  primaryMove: SpecialMove

  @ManyToOne(() => SpecialMove)
  secondaryMove: SpecialMove

  @ManyToOne(() => MaterialType)
  material: MaterialType
}

export default Weapon
