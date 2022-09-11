import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { Inventory } from '../../entities/inventory.entity'
import { Material } from './material.entity'
import { WeaponInstanceAttribute } from './weapon-instance-attribute.entity'
import { Weapon } from './weapon.entity'

@Entity()
export class WeaponInstance extends BaseEntity {
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
