import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"

@Entity('map')
export class TileData extends BaseEntity {
  @Column()
  tileIndex: number

  @Column()
  terrain: number
}

(globalThis as any).TileData = TileData
