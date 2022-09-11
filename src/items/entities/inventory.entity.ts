import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { ArmorInstance } from './armor-instance.entity'

@Entity()
export class Inventory extends BaseEntity {
  @Column({ default: false }) limit: boolean
  @Column() gold: number

  // @OneToMany(() => WeaponInstance, (wi) => wi.inventory, { nullable: true })
  // weapons: WeaponInstance[]

  @OneToMany(() => ArmorInstance, (ai) => ai.inventory, { nullable: true })
  armor: ArmorInstance[]

  // @OneToMany(() => JewelryInstance, (ji) => ji.inventory, { nullable: true })
  // jewelry: JewelryInstance[]

  // @OneToMany(() => SpellbookInstance, (si) => si.inventory, { nullable: true })
  // spellbooks: SpellbookInstance[]
}
