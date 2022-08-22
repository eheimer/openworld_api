import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator'

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @Min(1)
  @Max(4)
  @IsNotEmpty()
  strength: number

  @IsNumber()
  @Min(1)
  @Max(4)
  @IsNotEmpty()
  dexterity: number

  @IsNumber()
  @Min(1)
  @Max(4)
  @IsNotEmpty()
  intelligence: number
}
