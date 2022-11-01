import { Expose } from 'class-transformer'
import { SkillDto } from '../../skills/dto/skill.dto'
import { DTO } from '../../decorators/dto-property.decorator'

export class RaceDto {
  @Expose() id: number
  @Expose() name: string
  @Expose() description: string
  @Expose() @DTO(SkillDto) skills: SkillDto[]
}
