import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import Inventory from './Inventory'
import Material from './Material'
import Weapon from './Weapon'
import WeaponInstanceAttribute from './WeaponInstanceAttribute'

@Entity()
export class WeaponInstance extends EntityBase {
  @Column() equipped: boolean
  @Column() damaged: boolean

  @ManyToOne(() => Weapon, { nullable: false })
  weapon: Weapon

  @OneToMany(() => WeaponInstanceAttribute, (wia) => wia.weapon, {
    nullable: true
  })
  attributes: WeaponInstanceAttribute[]

  @ManyToOne(() => Material, { nullable: false })
  material: Material

  @ManyToOne(() => Inventory, (i) => i.weapons, { nullable: false })
  inventory: Inventory
}

export default WeaponInstance
