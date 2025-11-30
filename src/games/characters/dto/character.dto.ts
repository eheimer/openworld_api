import { Expose, Transform } from 'class-transformer'
import { DTO } from "../../../decorators/dto-property.decorator"
import { PlayerDto } from "../../../players/dto/player.dto"

export class CharacterDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @DTO((globalThis as any).GameDto)
  game: any

  @Expose()
  @DTO(PlayerDto)
  player: PlayerDto

  @Expose()
  @Transform(({ obj }) => obj.race?.name)
  raceName: string

  @Expose()
  @DTO((globalThis as any).BattleDto)
  battle: any
}

(globalThis as any).CharacterDto = CharacterDto
