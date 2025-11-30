import { IsNotEmpty, IsString } from 'class-validator'

export class RenamePetDto {
  @IsString()
  @IsNotEmpty()
  name: string
}

