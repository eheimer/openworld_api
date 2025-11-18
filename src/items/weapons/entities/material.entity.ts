import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity.js"
import { MaterialType } from "./material-type.entity.js"
import { registerEntity } from "../../../entityRegistry.js"

@Entity()
export class Material extends BaseEntity {
  @Column() name: string
  @Column() weaponDurability: number
  @Column() canSpawn: boolean

  @ManyToOne(() => MaterialType)
  baseMaterial: MaterialType
}

registerEntity('Material', Material)
