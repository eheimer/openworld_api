import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, OneToMany } from 'typeorm'
import ArmorInstance from './ArmorInstance'
import JewelryInstance from './JewelryInstance'
import SpellbookInstance from './SpellbookInstance'
import WeaponInstance from './WeaponInstance'

@Entity()
export default class Inventory extends EntityBase {
  @Column() capacity: number
  @Column() limit: boolean
  @Column() gold: number

  @OneToMany(() => WeaponInstance, (wi) => wi.inventory, { nullable: true })
  weapons: WeaponInstance[]

  @OneToMany(() => ArmorInstance, (ai) => ai.inventory, { nullable: true })
  armor: ArmorInstance[]

  @OneToMany(() => JewelryInstance, (ji) => ji.inventory, { nullable: true })
  jewelry: JewelryInstance[]

  @OneToMany(() => SpellbookInstance, (si) => si.inventory, { nullable: true })
  spellbooks: SpellbookInstance[]
}
