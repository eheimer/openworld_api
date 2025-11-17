import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
// runtime entity references are resolved via globalThis to avoid static import cycles

@Entity()
export class Inventory extends BaseEntity {
  @Column({ default: false }) limit: boolean
  @Column({ default: 0 }) gold: number

  @OneToMany(() => (globalThis as any).WeaponInstance, (wi) => (wi as any).inventory, { nullable: true, cascade: ['insert', 'update'] })
  weapons: any[]

  @OneToMany(() => (globalThis as any).ArmorInstance, (ai) => (ai as any).inventory, { nullable: true, cascade: ['insert', 'update'] })
  armor: any[]

  @OneToMany(() => (globalThis as any).JewelryInstance, (ji) => (ji as any).inventory, { nullable: true, cascade: ['insert', 'update'] })
  jewelry: any[]

  @OneToMany(() => (globalThis as any).SpellbookInstance, (si) => (si as any).inventory, { nullable: true })
  spellbooks: any[]
}

(globalThis as any).Inventory = Inventory
