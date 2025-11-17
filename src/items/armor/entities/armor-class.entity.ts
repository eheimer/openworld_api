import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
// runtime references resolved via globalThis; avoid type-only imports to reduce static cycles

@Entity()
export class ArmorClass extends BaseEntity {
  @Column() name: string
  @Column() durability: number

  @OneToMany(() => (globalThis as any).ArmorClassDamageReduction, (cdr) => (cdr as any).armorClass)
  // use any[] to avoid emitting runtime type metadata that can trigger TDZ in circular imports
  reductions: any[]
}

// register runtime class on globalThis so relation decorators can reference it without importing
(globalThis as any).ArmorClass = ArmorClass
