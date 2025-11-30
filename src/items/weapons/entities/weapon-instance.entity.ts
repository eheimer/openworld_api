import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { Inventory } from "../../entities/inventory.entity"
import { Material } from "./material.entity"
// runtime references resolved via entityRegistry to avoid scattered globalThis
import { Weapon } from "./weapon.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class WeaponInstance extends BaseEntity {
  @Column() equipped: boolean
  @Column() damaged: boolean

  @ManyToOne(() => Weapon, { nullable: false })
  weapon: Weapon

  @OneToMany(() => getEntity('WeaponInstanceAttribute') as any, (wia: any) => wia.weapon, {
    nullable: true,
    cascade: ['insert']
  })
  attributes: any[]

  @ManyToOne(() => Material, { nullable: false })
  material: Material

  @ManyToOne(() => Inventory, (i) => i.weapons, { nullable: false })
  inventory: Inventory
}

registerEntity('WeaponInstance', WeaponInstance)
