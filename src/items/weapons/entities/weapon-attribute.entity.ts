import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"
import { Column, Entity, ManyToOne } from 'typeorm'
import { WeaponSkill } from "./weapon-skill.entity.js"

@Entity()
export class WeaponAttribute extends MagicalItemAttribute {
  @Column() hand: number

  @ManyToOne(() => WeaponSkill)
  skill: WeaponSkill
}

(globalThis as any).WeaponAttribute = WeaponAttribute
