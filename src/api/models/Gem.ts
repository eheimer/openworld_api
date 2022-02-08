import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne } from 'typeorm'
import GemRarity from './GemRarity'
import ItemCategory from './ItemCategory'

@Entity()
export default class Gem extends EntityBase {
  @Column() name: string
  @Column() weight: number
  @Column() image: string
  @Column() level: number

  @ManyToOne(() => GemRarity)
  rarity: GemRarity

  @ManyToOne(() => ItemCategory)
  category: ItemCategory
}
