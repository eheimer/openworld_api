import { Column, Entity } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { getEntity, registerEntity } from "../../entityRegistry"

@Entity('map')
export class TileData extends BaseEntity {
  @Column()
  tileIndex: number

  @Column()
  terrain: number
}

registerEntity('TileData', TileData)
