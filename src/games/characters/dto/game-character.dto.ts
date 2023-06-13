import { Expose } from 'class-transformer'
import { DTO } from '../../../decorators/dto-property.decorator'
import { GameDto } from '../../dto/game.dto'
import { CharacterDto } from './character.dto'

export class GameCharacterDto {
  @Expose()
  @DTO(GameDto)
  game: GameDto

  @Expose()
  @DTO(CharacterDto)
  character: CharacterDto

  @Expose()
  owner: boolean
}
