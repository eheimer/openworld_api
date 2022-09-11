import { Column, Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { Gem } from './gem.entity'
import { Inventory } from '../../entities/inventory.entity'
import { JewelryInstanceAttribute } from './jewelry-instance-attribute.entity'
import { JewelryLocation } from './jewelry-location.entity'

@Entity()
export class JewelryInstance extends BaseEntity {
  @Column() equipped: boolean
  @Column() damaged: boolean

  @ManyToOne(() => Gem, { nullable: false })
  gem: Gem

  @ManyToOne(() => JewelryLocation, { nullable: false })
  location: JewelryLocation

  @OneToMany(() => JewelryInstanceAttribute, (jia) => jia.jewelry, {
    nullable: true
  })
  attributes: JewelryInstanceAttribute[]

  @ManyToOne(() => Inventory, (i) => i.jewelry, { nullable: false })
  inventory: Inventory
}
