import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { ArmorInstance } from '../armor/entities/armor-instance.entity'
import { JewelryInstance } from '../jewelry/entities/jewelry-instance.entity'
import { SpellbookInstance } from '../spellbooks/entities/spellbook-instance.entity'
import { WeaponInstance } from '../weapons/entities/weapon-instance.entity'

@Entity()
export class Inventory extends BaseEntity {
  @Column({ default: false }) limit: boolean
  @Column({ default: 0 }) gold: number

  @OneToMany(() => WeaponInstance, (wi) => wi.inventory, { nullable: true, cascade: ['insert', 'update'] })
  weapons: WeaponInstance[]

  @OneToMany(() => ArmorInstance, (ai) => ai.inventory, { nullable: true, cascade: ['insert', 'update'] })
  armor: ArmorInstance[]

  @OneToMany(() => JewelryInstance, (ji) => ji.inventory, { nullable: true, cascade: ['insert', 'update'] })
  jewelry: JewelryInstance[]

  @OneToMany(() => SpellbookInstance, (si) => si.inventory, { nullable: true })
  spellbooks: SpellbookInstance[]
}
