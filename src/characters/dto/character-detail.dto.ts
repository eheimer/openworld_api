import { Expose } from 'class-transformer'
import { CharacterDto } from './character.dto'
import { Inventory } from '../../items/entities/inventory.entity'

export class CharacterDetailDto extends CharacterDto {
  @Expose() strength: number
  @Expose() dexterity: number
  @Expose() intelligence: number
  @Expose() inventory: Inventory
}
