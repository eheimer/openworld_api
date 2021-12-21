import { EntityBase } from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export class DamageType extends EntityBase {
  @Column() name: string
  @Column() description: string
  @Column() chaos: boolean
  @Column() display: boolean
  @Column() soundurl: string
  @Column() imgurl: string
}
