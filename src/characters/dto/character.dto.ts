import { Expose } from 'class-transformer'
import { DTO } from 'src/decorators/dto-property.decorator'
import { PlayerDto } from '../../players/dto/player.dto'
import { GameDto } from '../../games/dto/game.dto'

export class CharacterDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @DTO(GameDto)
  game: GameDto

  @Expose()
  @DTO(PlayerDto)
  player: PlayerDto
}
