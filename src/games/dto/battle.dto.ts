import { Expose, Transform } from 'class-transformer'
import { DTO } from "../../decorators/dto-property.decorator.js"
import { MonsterInstanceDto } from "../../monsters/dto/monster-instance.dto.js"
import { MonsterInstance } from "../../monsters/entities/monster-instance.entity.js"
import { Character } from "../characters/entities/character.entity.js"

export class BattleDto {
  @Expose() id: number

  @Transform(({ obj }) => obj.createdAt.toISOString())
  @Expose()
  displayName: string

  @Expose()
  round: number

  @Transform(({ obj }) => obj.initiator?.id ?? obj.initiator)
  @Expose()
  initiator: number

  @Expose()
  @DTO((globalThis as any).CharacterDto)
  participants: any[]

  @Expose()
  @DTO(MonsterInstanceDto)
  enemies: MonsterInstance[]
}

(globalThis as any).BattleDto = BattleDto
