import { Expose, Transform } from 'class-transformer'
import { DTO } from '../../../decorators/dto-property.decorator'
import { GameDto } from '../../dto/game.dto'
import { BattleDto } from '../../dto/battle.dto'
import { PlayerDto } from '../../../players/dto/player.dto'

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

  @Expose()
  @DTO(BattleDto)
  battle: BattleDto
}
