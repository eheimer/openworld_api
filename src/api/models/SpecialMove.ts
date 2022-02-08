import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export class SpecialMove extends EntityBase {
  @Column() name: string
  @Column() stamina: number
}

export default SpecialMove
