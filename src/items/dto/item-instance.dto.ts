import { Expose, Transform } from 'class-transformer'

//a dto that will accommodate any magical item type: weapon, armor, jewelry
export class ItemInstanceDto {
  @Transform(({ obj }) => {
    if (obj.weapon) return 'weapon'
    if (obj.armorClass) return 'armor'
    if (obj.gem) return 'jewelry'
    return null
  })
  @Expose()
  itemType: string

  @Transform(({ obj }) => {
    if (obj.weapon) {
      return `${obj.material?.name} ${obj.weapon?.name}`
    }
    if (obj.armorClass) {
      return `${obj.armorClass?.name} ${obj.location?.name}`
    }
    if (obj.gem) {
      return `${obj.gem?.name} ${obj.location?.name}`
    }
  })
  @Expose()
  name: string

  @Transform(({ obj }) =>
    obj.attributes?.map((a) => {
      return { name: a.attribute.name, value: a.value || undefined }
    })
  )
  @Expose()
  attributes: { name: string; value: number }[]

  @Expose() damaged: boolean
  @Expose() equipped: boolean

  // weapons only
  @Transform(({ obj }) => obj.material?.name || undefined)
  @Expose()
  material: string
  @Transform(({ obj }) => obj.weapon?.damage || undefined)
  @Expose()
  damage: string
  @Transform(({ obj }) => obj.weapon?.range || undefined)
  @Expose()
  range: number
  @Transform(({ obj }) => obj.weapon?.speed || undefined)
  @Expose()
  speed: number
  @Transform(({ obj }) => obj.weapon?.strength || undefined)
  @Expose()
  strength: number
  @Transform(({ obj }) => obj.weapon?.hand || undefined)
  @Expose()
  hand: number
  @Transform(({ obj }) => obj.weapon?.skill.name || undefined)
  @Expose()
  skill: string
  @Transform(({ obj }) => obj.weapon?.primaryMove.name || undefined)
  @Expose()
  primaryMove: string
  @Transform(({ obj }) => obj.weapon?.secondaryMove.name || undefined)
  @Expose()
  secondaryMove: string

  // jewelry only
  @Transform(({ obj }) => obj.gem?.name || undefined)
  @Expose()
  gem: string

  // armor only
  @Transform(({ obj }) => {
    return obj.reductions?.map((r) => {
      return { damageType: r.damageType.name, value: r.value }
    })
  })
  @Expose()
  reductions: { damageType: string; value: number }[]

  // armor and jewelry only
  @Transform(({ obj }) => obj.location?.name || undefined)
  @Expose()
  location: string
}
