import { Column, Entity } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'

@Entity('map')
export class TileData extends BaseEntity {
  @Column()
  tileIndex: number

  @Column()
  terrain: number
}
