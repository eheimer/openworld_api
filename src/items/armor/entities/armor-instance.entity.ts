import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { ArmorClass } from "./armor-class.entity"
// runtime references resolved via entityRegistry to avoid scattered globalThis
import { ArmorLocation } from "./armor-location.entity"
import { Inventory } from "../../entities/inventory.entity"
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class ArmorInstance extends BaseEntity {
  /**
   * whether or not this item is equipped
   * @TODO I don't think this belongs on the item.  It should be
   * a function of the Character whose Inventory contains it
   */
  @Column() equipped: boolean
  /**
   * whether or not this item is damaged
   */
  @Column() damaged: boolean

  @ManyToOne(() => ArmorClass, { nullable: false })
  armorClass: ArmorClass

  @ManyToOne(() => ArmorLocation, { nullable: false })
  location: ArmorLocation

  @OneToMany(() => getEntity('ArmorInstanceAttribute') as any, (aia) => (aia as any).armor, {
    nullable: true,
    cascade: ['insert']
  })
  // avoid runtime metadata to prevent ESM TDZ from circular imports
  attributes: any[]

  @ManyToOne(() => Inventory, (i) => i.armor, { nullable: false })
  inventory: Inventory

  @OneToMany(() => getEntity('ArmorInstanceDamageReduction') as any, (aidr) => (aidr as any).armor, {
    nullable: true,
    cascade: ['insert']
  })
  reductions: any[]
}
registerEntity('ArmorInstance', ArmorInstance)
