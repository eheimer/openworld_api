import EntityBase from '../../utils/entities/EntityBase'
import { Column, Entity, ManyToOne } from 'typeorm'
import Monster from './Monster'

@Entity()
export default class MonsterClue extends EntityBase {
  @Column() trackingLevel: number
  @Column() clue: string

  @ManyToOne(() => Monster, (m) => m.clues)
  monster: Monster
}
