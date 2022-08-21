import { Expose } from 'class-transformer'

export class PlayerDto {
  @Expose() id: number
  @Expose() username: string
  @Expose() lastSeenAt: Date
}
