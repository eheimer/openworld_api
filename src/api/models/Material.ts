import { Column, Entity, ManyToOne } from 'typeorm'

import EntityBase from '../../utils/entities/EntityBase'
import MaterialType from './MaterialType'

@Entity()
export default class Material extends EntityBase {
  @Column() name: string
  @Column() weaponDurability: number
  @Column() canSpawn: boolean
  @ManyToOne(() => MaterialType)
  base: MaterialType
}
