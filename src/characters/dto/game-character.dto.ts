import { Expose } from 'class-transformer'
import { DTO } from '../../decorators/dto-property.decorator'
import { GameDto } from '../../games/dto/game.dto'
import { CharacterDto } from '../../characters/dto/character.dto'

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
