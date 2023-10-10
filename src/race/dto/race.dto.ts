import { Expose } from 'class-transformer'
import { DTO } from '../../decorators/dto-property.decorator'
import { RaceSkillDto } from './raceskill.dto'

export class RaceDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() description: string
  @Expose() @DTO(RaceSkillDto) skills: RaceSkillDto[]
}
