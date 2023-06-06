import { Expose, Transform } from 'class-transformer'

export class BattleDto {
  @Expose()
  id: number
  @Transform(({ obj }) => obj.createdAt.toISOString())
  @Expose()
  displayName: string
}
