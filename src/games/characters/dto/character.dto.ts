import { Expose, Transform } from 'class-transformer'
import { DTO } from '../../../decorators/dto-property.decorator'
import { PlayerDto } from '../../../players/dto/player.dto'
import { GameDto } from '../../dto/game.dto'

export class CharacterDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @DTO(GameDto)
  game: GameDto

  @Expose()
  @DTO(PlayerDto)
  player: PlayerDto

  @Expose()
  @Transform(({ obj }) => {
    return obj.race?.name
  })
  race: string
}
