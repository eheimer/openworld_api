import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { GemRarity } from './gem-rarity.entity'
import { ItemCategory } from './item-category.entity'

@Entity()
export class Gem extends BaseEntity {
  @Column() name: string
  @Column() weight: number
  @Column() image: string
  @Column() level: number

  @ManyToOne(() => GemRarity)
  rarity: GemRarity

  @ManyToOne(() => ItemCategory)
  category: ItemCategory
}
