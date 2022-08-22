import { Expose } from 'class-transformer'
import { DTO } from 'src/decorators/dto-property.decorator'
import { PlayerDto } from '../../players/dto/player.dto'

export class GameDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @DTO(PlayerDto)
  owner: PlayerDto

  @Expose()
  @DTO(PlayerDto)
  players: PlayerDto[]
}
