import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { ArmorClass } from './armor-class.entity'
import { ArmorInstanceAttribute } from './armor-instance-attribute.entity'
import { ArmorInstanceDamageReduction } from './armor-instance-damage-reduction.entity'
import { ArmorLocation } from './armor-location.entity'
import { Inventory } from '../../entities/inventory.entity'

@Entity()
export class ArmorInstance extends BaseEntity {
  /**
   * whether or not this item is equipped
   * @TODO I don't think this belongs on the item.  It should be
   * a function of the Character whose Inventory contains it
   */
  @Column() equipped: boolean
  /**
   * whether or not this item is damaged
   */
  @Column() damaged: boolean

  @ManyToOne(() => ArmorClass, { nullable: false })
  armorClass: ArmorClass

  @ManyToOne(() => ArmorLocation, { nullable: false })
  location: ArmorLocation

  @OneToMany(() => ArmorInstanceAttribute, (aia) => aia.armor, {
    nullable: true,
    cascade: ['insert']
  })
  attributes: ArmorInstanceAttribute[]

  @ManyToOne(() => Inventory, (i) => i.armor, { nullable: false })
  inventory: Inventory

  @OneToMany(() => ArmorInstanceDamageReduction, (aidr) => aidr.armor, {
    nullable: true,
    cascade: ['insert']
  })
  reductions: ArmorInstanceDamageReduction[]
}
