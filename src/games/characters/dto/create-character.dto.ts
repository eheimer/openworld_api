import { IsNotEmpty, IsString } from 'class-validator'

export class CreateCharacterDto {
  @IsString()
  @IsNotEmpty()
  name: string
}
