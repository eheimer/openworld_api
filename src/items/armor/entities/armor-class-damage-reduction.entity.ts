import { Column, Entity, ManyToOne } from 'typeorm'
import { BaseEntity } from "../../../common/BaseEntity"
// avoid type-only imports here; runtime references use entityRegistry
import { getEntity, registerEntity } from "../../../entityRegistry"

@Entity()
export class ArmorClassDamageReduction extends BaseEntity {
  @Column() level: number
  @Column() reduction: string

  @ManyToOne(() => getEntity('ArmorClass') as any)
  // use any for the property type to avoid ESM circular/TDZ at module initialization
  armorClass: any

  @ManyToOne(() => getEntity('DamageType') as any)
  damageType: any
}

registerEntity('ArmorClassDamageReduction', ArmorClassDamageReduction)
