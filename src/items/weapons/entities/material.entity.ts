import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
import { MaterialType } from "./material-type.entity"
import { registerEntity } from "../../../entityRegistry"

@Entity()
export class Material extends BaseEntity {
  @Column() name: string
  @Column() weaponDurability: number
  @Column() canSpawn: boolean

  @ManyToOne(() => MaterialType)
  baseMaterial: MaterialType
}

registerEntity('Material', Material)
