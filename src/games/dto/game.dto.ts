import { Expose } from 'class-transformer'
import { DTO } from 'src/decorators/dto-property.decorator'
import { PlayerDto } from '../../players/dto/player.dto'
import { PlayerDetailDto } from '../../players/dto/player-detail.dto'
import { CreateGameDto } from './create-game.dto'

export abstract class GameDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @DTO(PlayerDto)
  owner: PlayerDto

  @Expose()
  @DTO(PlayerDto)
  players: PlayerDto[]
}
