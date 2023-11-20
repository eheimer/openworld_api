import { Expose } from 'class-transformer'
import { SpellbookInstanceDto } from '../spellbooks/dto/spellbook-instance.dto'
import { DTO } from '../../decorators/dto-property.decorator'
import { ItemInstanceDto } from './item-instance.dto'

export class InventoryDto {
  @Expose() id: number
  @Expose() capacity: number
  @Expose() gold: number
  @Expose() @DTO(ItemInstanceDto) weapons: ItemInstanceDto[]
  @Expose() @DTO(ItemInstanceDto) armor: ItemInstanceDto[]
  @Expose() @DTO(ItemInstanceDto) jewelry: ItemInstanceDto[]
  @Expose() @DTO(SpellbookInstanceDto) spellbooks: SpellbookInstanceDto[]
}
