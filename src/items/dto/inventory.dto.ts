import { Expose, Transform } from 'class-transformer'
import { SpellbookInstanceDto } from '../spellbooks/dto/spellbook-instance.dto'
import { DTO } from '../../decorators/dto-property.decorator'
import { ItemInstanceDto } from './item-instance.dto'
import { Logger } from '@nestjs/common'

export class InventoryDto {
  @Expose() id: number
  @Expose() capacity: number
  @Expose() gold: number
  @Expose() @DTO(ItemInstanceDto) weapons: ItemInstanceDto[]
  @Expose() @DTO(ItemInstanceDto) armor: ItemInstanceDto[]
  @Expose() @DTO(ItemInstanceDto) jewelry: ItemInstanceDto[]
  @Expose() @DTO(SpellbookInstanceDto) spellbooks: SpellbookInstanceDto[]

  @Transform(({ obj }) => {
    const equipped = []
    if (obj.weapons) {
      obj.weapons.forEach((weapon) => {
        Logger.log(`weapon ${weapon.id} equipped: ${weapon.equipped}`)
        if (weapon.equipped) {
          equipped.push({ itemType: 'weapon', location: undefined, id: weapon.id })
        }
      })
    }
    if (obj.armor) {
      obj.armor.forEach((armor) => {
        if (armor.equipped) {
          equipped.push({ itemType: 'armor', location: armor.location.location.id, id: armor.id })
        }
      })
    }
    if (obj.jewelry) {
      obj.jewelry.forEach((jewelry) => {
        if (jewelry.equipped) {
          equipped.push({ itemType: 'jewelry', location: jewelry.location.location.id, id: jewelry.id })
        }
      })
    }
    Logger.log({ equipped })
    return equipped
  })
  @Expose()
  equipped: { itemType: string; location: number; id: number }[]
}
