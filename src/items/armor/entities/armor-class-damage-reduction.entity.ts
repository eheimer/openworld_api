import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
// avoid type-only imports here; runtime references use globalThis

@Entity()
export class ArmorClassDamageReduction extends BaseEntity {
  @Column() level: number
  @Column() reduction: string

  @ManyToOne(() => (globalThis as any).ArmorClass)
  // use any for the property type to avoid ESM circular/TDZ at module initialization
  armorClass: any

  @ManyToOne(() => (globalThis as any).DamageType)
  damageType: any
}

// register runtime class on globalThis so other modules can reference without importing
(globalThis as any).ArmorClassDamageReduction = ArmorClassDamageReduction
