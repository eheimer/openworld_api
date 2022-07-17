import { Column, Entity, ManyToOne } from 'typeorm'

import EntityBase from '../../utils/entities/EntityBase'
import MaterialType from './MaterialType'

@Entity()
export class Material extends EntityBase {
  @Column() name: string
  @Column() weaponDurability: number
  @Column() canSpawn: boolean
  @ManyToOne(() => MaterialType)
  baseMaterial: MaterialType
}

export default Material
