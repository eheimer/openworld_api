import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute.js"
import { Column, Entity, ManyToOne } from 'typeorm'
import { WeaponSkill } from "./weapon-skill.entity.js"
import { registerEntity } from "../../../entityRegistry.js"

@Entity()
export class WeaponAttribute extends MagicalItemAttribute {
  @Column() hand: number

  @ManyToOne(() => WeaponSkill)
  skill: WeaponSkill
}

registerEntity('WeaponAttribute', WeaponAttribute)
