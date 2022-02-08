import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export default class SpecialMove extends EntityBase {
  @Column() name: string
  @Column() stamina: number
}
