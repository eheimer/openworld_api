import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
import { getEntity, registerEntity } from "../../entityRegistry.js"

@Entity('map')
export class TileData extends BaseEntity {
  @Column()
  tileIndex: number

  @Column()
  terrain: number
}

registerEntity('TileData', TileData)
