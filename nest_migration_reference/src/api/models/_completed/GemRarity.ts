import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity } from 'typeorm'

@Entity()
export class GemRarity extends EntityBase {
  @Column() name: string
  @Column() durability: number
}

export default GemRarity
