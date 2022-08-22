import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string

  @IsNumber()
  @IsNotEmpty()
  strength: number

  @IsNumber()
  @IsNotEmpty()
  dexterity: number

  @IsNumber()
  @IsNotEmpty()
  intelligence: number
}
