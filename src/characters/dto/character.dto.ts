import { Expose } from 'class-transformer'
import { DTO } from 'src/decorators/dto-property.decorator'
import { Game } from '../../games/game.entity'
import { Player } from '../../players/player.entity'

export class CharacterDto {
  @Expose() id: number
  @Expose() name: string

  @Expose()
  @DTO(Game)
  game: Game

  @Expose()
  @DTO(Player)
  player: Player
}
