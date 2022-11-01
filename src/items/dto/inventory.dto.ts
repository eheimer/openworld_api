import { Expose } from 'class-transformer'
import { WeaponInstanceDto } from '../weapons/dto/weapon-instance.dto'
import { ArmorInstanceDto } from '../armor/dto/armor-instance.dto'
import { JewelryInstanceDto } from '../jewelry/dto/jewelry-instance.dto'
import { SpellbookInstanceDto } from '../spellbooks/dto/spellbook-instance.dto'
import { DTO } from 'src/decorators/dto-property.decorator'

export class InventoryDto {
  @Expose() id: number
  @Expose() capacity: number
  @Expose() gold: number
  @Expose() @DTO(WeaponInstanceDto) weapons: WeaponInstanceDto[]
  @Expose() @DTO(ArmorInstanceDto) armor: ArmorInstanceDto[]
  @Expose() @DTO(JewelryInstanceDto) jewelry: JewelryInstanceDto[]
  @Expose() @DTO(SpellbookInstanceDto) spellbooks: SpellbookInstanceDto[]
}
