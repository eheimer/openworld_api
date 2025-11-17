import { Column, Entity, ManyToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity.js"
// avoid importing Monster at module-load time; use globalThis in decorators

@Entity()
export class SlayerType extends BaseEntity {
  @Column() name: string

  @ManyToMany(() => (globalThis as any).Monster, (monster: any) => (monster as any).slayers)
  monsters: any[]
}

(globalThis as any).SlayerType = SlayerType
