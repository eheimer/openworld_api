import { PlayerDto } from "./player.dto.js"
import { Expose } from 'class-transformer'

export class PlayerDetailDto extends PlayerDto {
  @Expose() email: string
}

(globalThis as any).PlayerDetailDto = PlayerDetailDto
