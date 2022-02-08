import { Column, Entity, ManyToMany } from 'typeorm'

import EntityBase from '../../utils/entities/EntityBase'
import Monster from './Monster'

@Entity()
export default class SlayerType extends EntityBase {
  @Column() name: string

  @ManyToMany(() => Monster, (monster) => monster.slayers)
  monsters: Monster[]
}
