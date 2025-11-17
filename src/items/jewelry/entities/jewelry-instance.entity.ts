import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { Gem } from "./gem.entity.js"
import { Inventory } from "../../entities/inventory.entity.js"
// runtime references resolved via globalThis; avoid type imports to reduce static cycles
import { JewelryLocation } from "./jewelry-location.entity.js"

@Entity()
export class JewelryInstance extends BaseEntity {
  @Column() equipped: boolean
  @Column() damaged: boolean

  @ManyToOne(() => Gem, { nullable: false })
  gem: Gem

  @ManyToOne(() => JewelryLocation, { nullable: false })
  location: JewelryLocation

  @OneToMany(() => (globalThis as any).JewelryInstanceAttribute, (jia: any) => jia.jewelry, {
    nullable: true,
    cascade: ['insert']
  })
  attributes: any[]

  @ManyToOne(() => Inventory, (i) => i.jewelry, { nullable: false })
  inventory: Inventory
}

(globalThis as any).JewelryInstance = JewelryInstance
