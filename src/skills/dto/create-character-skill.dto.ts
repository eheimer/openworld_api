import { IsNotEmpty, IsNumber } from 'class-validator'

export class CreateCharacterSkillDto {
  @IsNotEmpty()
  @IsNumber()
  characterId: number

  @IsNotEmpty()
  @IsNumber()
  skillId: number
}

