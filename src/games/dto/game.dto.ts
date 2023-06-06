import { Expose } from 'class-transformer'
import { DTO } from '../../decorators/dto-property.decorator'
import { PlayerDto } from '../../players/dto/player.dto'
import { CharacterDto } from '../../characters/dto/character.dto'
import { BattleDto } from '../battles/dto/battle.dto'

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
  @DTO(CharacterDto)
  characters: CharacterDto[]

  @Expose()
  @DTO(BattleDto)
  battles: BattleDto[]
}
