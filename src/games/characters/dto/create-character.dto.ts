import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CharacterSkillDto } from './character-skill.dto'

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  raceId: number

  @IsArray()
  @IsNotEmpty()
  skills: CharacterSkillDto[]
}
