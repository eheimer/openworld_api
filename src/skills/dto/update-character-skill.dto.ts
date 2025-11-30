import { IsNotEmpty, IsNumber } from 'class-validator'
import { CreateCharacterSkillDto } from "./create-character-skill.dto"

export class UpdateCharacterSkillDto extends CreateCharacterSkillDto {
  @IsNotEmpty()
  @IsNumber()
  level: number
}

(globalThis as any).UpdateCharacterSkillDto = UpdateCharacterSkillDto
