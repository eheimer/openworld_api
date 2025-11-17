import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"

@Entity()
export class WeaponSkill extends BaseEntity {
  @Column() name: string
}

(globalThis as any).WeaponSkill = WeaponSkill
