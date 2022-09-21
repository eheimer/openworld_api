import { Expose } from 'class-transformer'
import { CharacterDto } from './character.dto'
import { InventoryDto } from '../../items/dto/inventory.dto'
import { DTO } from 'src/decorators/dto-property.decorator'

export class CharacterDetailDto extends CharacterDto {
  @Expose() strength: number
  @Expose() dexterity: number
  @Expose() intelligence: number
  @Expose() @DTO(InventoryDto) inventory: InventoryDto
}
