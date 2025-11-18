import { Expose } from 'class-transformer'
import { DTO } from "../../decorators/dto-property.decorator.js"
import { PlayerDto } from "../../players/dto/player.dto.js"


export class GameDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @DTO(PlayerDto)
  owner: PlayerDto

  @Expose()
  @DTO(PlayerDto)
  players: PlayerDto[]

  @Expose()
  @DTO((globalThis as any).CharacterDto)
  characters: any[]

  @Expose()
  @DTO((globalThis as any).BattleDto)
  battles: any[]
}

(globalThis as any).GameDto = GameDto
