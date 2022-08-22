import { Expose } from 'class-transformer'
import { CharacterDto } from './character.dto'

export class CharacterDetailDto extends CharacterDto {
  @Expose() strength: number
  @Expose() dexterity: number
  @Expose() intelligence: number
}
