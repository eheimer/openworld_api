import { Column, Entity, ManyToMany } from 'typeorm'
import { BaseEntity } from "../../common/BaseEntity"
import { getEntity, registerEntity } from "../../entityRegistry"
// avoid importing Monster at module-load time; use globalThis in decorators

@Entity()
export class SlayerType extends BaseEntity {
  @Column() name: string

  @ManyToMany(() => getEntity('Monster') as any, (monster: any) => (monster as any).slayers)
  monsters: any[]
}

registerEntity('SlayerType', SlayerType)
