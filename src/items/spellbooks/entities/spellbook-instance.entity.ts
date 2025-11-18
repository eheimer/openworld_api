import { Inventory } from "../../entities/inventory.entity.js"
import { Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { getEntity, registerEntity } from "../../../entityRegistry.js"
// runtime references resolved via globalThis; avoid type imports to reduce static cycles

@Entity()
export class SpellbookInstance extends BaseEntity {
  @OneToMany(() => getEntity('SpellbookInstanceAttribute') as any, (sia: any) => sia.spellbook, {
    nullable: true
  })
  attributes: any[]

  @ManyToOne(() => Inventory, (i) => i.spellbooks, { nullable: false })
  inventory: Inventory
}

registerEntity('SpellbookInstance', SpellbookInstance)
