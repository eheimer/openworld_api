import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { registerEntity } from "../../../entityRegistry"

@Entity()
export class WeaponSkill extends BaseEntity {
  @Column() name: string
}

registerEntity('WeaponSkill', WeaponSkill)
