import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator'
import { CharacterSkillDto } from "./character-skill.dto"

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

  @IsNumber()
  @IsNotEmpty()
  strength: number

  @IsNumber()
  @IsNotEmpty()
  intelligence: number

  @IsNumber()
  @IsNotEmpty()
  dexterity: number
}

