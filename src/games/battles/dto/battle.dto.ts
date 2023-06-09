import { Expose, Transform } from 'class-transformer'
import { DTO } from '../../../decorators/dto-property.decorator'
import { MonsterInstanceDto } from '../../../monsters/dto/monster-instance.dto'
import { MonsterInstance } from '../../../monsters/entities/monster-instance.entity'

export class BattleDto {
  @Expose() id: number
  @Transform(({ obj }) => obj.createdAt.toISOString())
  @Expose()
  displayName: string

  @Expose()
  @DTO(MonsterInstanceDto)
  enemies: MonsterInstance[]
}
