import { Column, Entity, OneToMany } from 'typeorm'
import { BaseEntity } from '../../../common/BaseEntity'
import { ArmorClassDamageReduction } from './armor-class-damage-reduction.entity'

@Entity()
export class ArmorClass extends BaseEntity {
  @Column() name: string
  @Column() durability: number

  @OneToMany(() => ArmorClassDamageReduction, (cdr) => cdr.armorClass)
  reductions: ArmorClassDamageReduction[]
}
