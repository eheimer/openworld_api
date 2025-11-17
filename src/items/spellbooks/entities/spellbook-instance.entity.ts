import { Inventory } from "../../entities/inventory.entity.js"
import { Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
// runtime references resolved via globalThis; avoid type imports to reduce static cycles

@Entity()
export class SpellbookInstance extends BaseEntity {
  @OneToMany(() => (globalThis as any).SpellbookInstanceAttribute, (sia: any) => sia.spellbook, {
    nullable: true
  })
  attributes: any[]

  @ManyToOne(() => Inventory, (i) => i.spellbooks, { nullable: false })
  inventory: Inventory
}

(globalThis as any).SpellbookInstance = SpellbookInstance
