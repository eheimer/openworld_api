import { IsNotEmpty, IsNumber, Max, Min } from 'class-validator'

export class FinalizeCharacterDto {
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

  @IsNumber()
  @IsNotEmpty()
  raceId: number
}
