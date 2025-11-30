import { IsNotEmpty, IsNumberString } from 'class-validator'

export class CreateMonsterInstanceDto {
  @IsNumberString()
  @IsNotEmpty()
  monsterId: string
}

