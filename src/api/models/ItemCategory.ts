import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export default class ItemCategory extends EntityBase {
  @Column() name: string
}
