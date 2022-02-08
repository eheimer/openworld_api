import { Column, Entity } from 'typeorm'
import EntityBase from './EntityBase'

@Entity()
export default class MagicalItemAttribute extends EntityBase {
  @Column() name: string
  @Column() value: string
}
