import { Inventory } from '../../entities/inventory.entity'
import { Entity, ManyToOne, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { SpellbookInstanceAttribute } from './spellbook-instance-attribute.entity'

@Entity()
export class SpellbookInstance extends BaseEntity {
  @OneToMany(() => SpellbookInstanceAttribute, (sia) => sia.spellbook, {
    nullable: true
  })
  attributes: SpellbookInstanceAttribute[]

  @ManyToOne(() => Inventory, (i) => i.spellbooks, { nullable: false })
  inventory: Inventory
}
