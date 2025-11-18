import { Expose } from 'class-transformer'
import { SkillDto } from "../../../skills/dto/skill.dto.js"

export class CharacterSkillDto extends SkillDto {
  @Expose() level: number
}

(globalThis as any).CharacterSkillDto = CharacterSkillDto
