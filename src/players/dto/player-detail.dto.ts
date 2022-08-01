import { PlayerDto } from './player.dto'
import { Expose } from 'class-transformer'

export class PlayerDetailDto extends PlayerDto {
  @Expose() email: string
  @Expose() password: string
}
