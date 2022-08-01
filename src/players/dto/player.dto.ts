import { Expose } from 'class-transformer'

export abstract class PlayerDto {
  @Expose() id: number
  @Expose() username: string
  @Expose() lastSeenAt: Date
}
