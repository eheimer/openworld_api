import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { Inventory } from "../../entities/inventory.entity.js"
import { Material } from "./material.entity.js"
// runtime references resolved via globalThis; avoid type imports to reduce static cycles
import { Weapon } from "./weapon.entity.js"

@Entity()
export class WeaponInstance extends BaseEntity {
  @Column() equipped: boolean
  @Column() damaged: boolean

  @ManyToOne(() => Weapon, { nullable: false })
  weapon: Weapon

  @OneToMany(() => (globalThis as any).WeaponInstanceAttribute, (wia: any) => wia.weapon, {
    nullable: true,
    cascade: ['insert']
  })
  attributes: any[]

  @ManyToOne(() => Material, { nullable: false })
  material: Material

  @ManyToOne(() => Inventory, (i) => i.weapons, { nullable: false })
  inventory: Inventory
}

(globalThis as any).WeaponInstance = WeaponInstance
