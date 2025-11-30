import { MagicalItemAttribute } from "../../../common/MagicalItemAttribute"
import { Column, Entity, ManyToOne } from 'typeorm'
import { WeaponSkill } from "./weapon-skill.entity"
import { registerEntity } from "../../../entityRegistry"

@Entity()
export class WeaponAttribute extends MagicalItemAttribute {
  @Column() hand: number

  @ManyToOne(() => WeaponSkill)
  skill: WeaponSkill
}

registerEntity('WeaponAttribute', WeaponAttribute)
