import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export class MaterialType extends EntityBase {
  @Column() name: string
}

export default MaterialType
