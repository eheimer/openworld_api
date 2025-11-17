import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { GemRarity } from "./gem-rarity.entity.js"
import { ItemCategory } from "../../entities/item-category.entity.js"

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

(globalThis as any).Gem = Gem
