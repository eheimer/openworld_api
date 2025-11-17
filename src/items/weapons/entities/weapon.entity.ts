import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { MaterialType } from "./material-type.entity.js"
import { SpecialMove } from "./special-move.entity.js"
import { WeaponSkill } from "./weapon-skill.entity.js"

@Entity()
export class Weapon extends BaseEntity {
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

(globalThis as any).Weapon = Weapon
