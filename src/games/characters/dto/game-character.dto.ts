import { Expose, Transform } from 'class-transformer'
import { DTO } from '../../../decorators/dto-property.decorator'
import { GameDto } from '../../dto/game.dto'

export class GameCharacterDto {
  @Expose()
  @DTO(GameDto)
  @Transform(({ obj }) => {
    return { id: obj?.game?.id, name: obj?.game?.name }
  })
  game: GameDto

  @Expose()
  @Transform(({ obj }) => {
    return { name: obj?.character?.name, race: obj?.character?.race?.name }
  })
  character: {
    name: string
    race: string
  }

  @Expose()
  owner: boolean
}
