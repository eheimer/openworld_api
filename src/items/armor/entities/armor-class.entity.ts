import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
// runtime references resolved via entityRegistry to avoid scattered globalThis
import { getEntity, registerEntity } from "../../../entityRegistry"
@Entity()
export class ArmorClass extends BaseEntity {
  @Column() name: string
  @Column() durability: number

  @OneToMany(() => getEntity('ArmorClassDamageReduction') as any, (cdr) => (cdr as any).armorClass)
  // use any[] to avoid emitting runtime type metadata that can trigger TDZ in circular imports
  reductions: any[]
}
registerEntity('ArmorClass', ArmorClass)
