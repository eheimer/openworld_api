import { Expose } from 'class-transformer'
import { SkillDto } from '../../skills/dto/skill.dto'

export class CharacterSkillDto extends SkillDto {
  @Expose() level: number
}
