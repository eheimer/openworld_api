import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { registerEntity } from "../../../entityRegistry.js"

@Entity()
export class WeaponSkill extends BaseEntity {
  @Column() name: string
}

registerEntity('WeaponSkill', WeaponSkill)
