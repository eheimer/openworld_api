import { Column, Entity, ManyToMany } from 'typeorm'
import { BaseEntity } from '../../common/BaseEntity'
import { Monster } from '../../monsters/entities/monster.entity'

@Entity()
export class SlayerType extends BaseEntity {
  @Column() name: string

  @ManyToMany(() => Monster, (monster) => monster.slayers)
  monsters: Monster[]
}
