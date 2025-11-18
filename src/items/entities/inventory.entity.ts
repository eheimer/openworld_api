import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"
// runtime entity references are resolved via globalThis to avoid static import cycles

@Entity()
export class Inventory extends BaseEntity {
  @Column({ default: false }) limit: boolean
  @Column({ default: 0 }) gold: number

  @OneToMany(() => getEntity('WeaponInstance') as any, (wi) => (wi as any).inventory, { nullable: true, cascade: ['insert', 'update'] })
  weapons: any[]

  @OneToMany(() => getEntity('ArmorInstance') as any, (ai) => (ai as any).inventory, { nullable: true, cascade: ['insert', 'update'] })
  armor: any[]

  @OneToMany(() => getEntity('JewelryInstance') as any, (ji) => (ji as any).inventory, { nullable: true, cascade: ['insert', 'update'] })
  jewelry: any[]

  @OneToMany(() => getEntity('SpellbookInstance') as any, (si) => (si as any).inventory, { nullable: true })
  spellbooks: any[]
}

registerEntity('Inventory', Inventory)
