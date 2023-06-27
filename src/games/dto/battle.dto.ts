import { Expose, Transform } from 'class-transformer'
import { DTO } from '../../decorators/dto-property.decorator'
import { MonsterInstanceDto } from '../../monsters/dto/monster-instance.dto'
import { MonsterInstance } from '../../monsters/entities/monster-instance.entity'
import { Character } from '../characters/entities/character.entity'
import { CharacterDto } from '../characters/dto/character.dto'
import { Logger } from '@nestjs/common'

export class BattleDto {
  @Expose() id: number

  @Transform(({ obj }) => obj.createdAt.toISOString())
  @Expose()
  displayName: string

  @Expose()
  round: number

  // @Expose()
  // @DTO(CharacterDto)
  // participants: Character[]

  // @Expose()
  // @DTO(MonsterInstanceDto)
  // enemies: MonsterInstance[]
}
